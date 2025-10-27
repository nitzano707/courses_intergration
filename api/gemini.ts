// /api/gemini.ts
// Serverless API (Vercel) – שומר את ה-API keys בצד השרת בלבד.
// דרישות: להגדיר ב-Vercel Environment Variable בשם GOOGLE_API_KEYS
// לדוגמה: GOOGLE_API_KEYS=key1,key2,key3  (ללא קידומות VITE_)

import { GoogleGenerativeAI } from '@google/generative-ai';

type Req = {
  method: string;
  body?: any;
};

type Res = {
  status: (code: number) => Res;
  json: (payload: any) => void;
  setHeader: (name: string, value: string) => void;
};

const MODEL_NAME = 'gemini-2.5-flash-lite';
const DEFAULT_RETRY_FALLBACK_SEC = 20;
const RETRY_BUFFER_SEC = 2; // נשתמש בו אם כל המפתחות מוגבלים

/** חילוץ מפתחות מהסביבה (רק בשרת) */
const readApiKeys = (): string[] => {
  const raw = (process.env.GOOGLE_API_KEYS || '').trim();
  return raw
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
};

/** האם זו שגיאת rate limit */
const isRateLimitError = (err: any): boolean => {
  const msg = String(err?.message ?? err ?? '').toLowerCase();
  const status = err?.status ?? err?.cause?.status ?? err?.response?.status;
  return (
    status === 429 ||
    msg.includes('too many requests') ||
    msg.includes('quota exceeded') ||
    msg.includes('rate limit')
  );
};

/** חילוץ זמן המתנה מהשגיאה (שניות) – מכותרת/JSON/טקסט חופשי */
const extractRetryDelaySeconds = (error: any): number | null => {
  // 1) כותרת HTTP Retry-After – אם הספרייה חשפה אותה
  const headers = error?.response?.headers;
  const retryAfterHeader =
    headers?.['retry-after'] ?? headers?.['Retry-After'] ?? null;
  if (retryAfterHeader) {
    const n = Number(retryAfterHeader);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  // 2) גוף JSON מובנה עם google.rpc.RetryInfo
  const bodyText: string =
    (typeof error?.response?.data === 'string' && error.response.data) ||
    (typeof error?.message === 'string' && error.message) ||
    JSON.stringify(error ?? '');

  const retryInfoMatch = /"retryDelay"\s*:\s*"(\d+)s"/i.exec(bodyText);
  if (retryInfoMatch) {
    const secs = Number(retryInfoMatch[1]);
    if (!Number.isNaN(secs) && secs > 0) return secs;
  }

  // 3) טקסט חופשי: "Please retry in 22.85s"
  const freeTextMatch = /retry in (\d+(\.\d+)?)s/i.exec(bodyText);
  if (freeTextMatch) {
    const secs = parseFloat(freeTextMatch[1]);
    if (!Number.isNaN(secs) && secs > 0) return Math.ceil(secs);
  }

  return null;
};

/** עיבוד יחיד עם key נתון – מחזיר טקסט או זורק שגיאה */
const callModelWithKey = async (key: string, prompt: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.() ?? '';
  if (!text) throw new Error('Empty response from Gemini API.');
  return text;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt".' });
    }

    const keys = readApiKeys();
    if (keys.length === 0) {
      return res.status(500).json({ error: 'No API keys configured on server (GOOGLE_API_KEYS).' });
    }

    const perKeyRetryDelays: number[] = [];

    // Failover: מנסים מפתחות לפי הסדר עד שמתקבלת תשובה
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      try {
        const text = await callModelWithKey(key, prompt);
        return res.status(200).json({ text });
      } catch (err: any) {
        // אם זה rate limit – אוספים delay וממשיכים מיד למפתח הבא
        if (isRateLimitError(err)) {
          const delay = extractRetryDelaySeconds(err) ?? DEFAULT_RETRY_FALLBACK_SEC;
          perKeyRetryDelays.push(delay);
          continue;
        }

        // API_KEY_INVALID – ננסה מפתח הבא, לא נעצור את כל השרשרת
        const msg = String(err?.message ?? '').toLowerCase();
        if (msg.includes('api key not valid') || msg.includes('api_key_invalid')) {
          continue;
        }

        // שגיאה אחרת – עוצרים
        console.error('Gemini non-rate-limit error:', err);
        return res.status(500).json({ error: 'Gemini API error' });
      }
    }

    // אם כל המפתחות מוגבלים – מחזירים 429 + Retry-After
    if (perKeyRetryDelays.length > 0) {
      const minDelay = Math.min(...perKeyRetryDelays);
      const effective = Math.max(1, Math.ceil(minDelay + RETRY_BUFFER_SEC));
      res.setHeader('Retry-After', String(effective));
      return res.status(429).json({
        error: 'All API keys are rate-limited.',
        retryDelay: effective,
      });
    }

    // מצב קצה: לא הצליחו קריאות אך אין מידע על דיליי
    return res.status(500).json({ error: 'Failed to generate with all API keys.' });
  } catch (error: any) {
    console.error('Gemini handler fatal error:', error);
    return res.status(500).json({ error: error?.message ?? 'Internal error' });
  }
}
