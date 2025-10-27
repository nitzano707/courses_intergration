// src/services/geminiService.ts
// צד-לקוח: לא פונה ישירות ל-Google, אלא רק ל-/api/gemini.
// אם השרת מחזיר 429 – קוראים את Retry-After ומתרגמים ל-retryDelay עבור ה-UI.

interface Course {
  CourseName: string;
  RationaleAbstract: string;
}

export interface IntegrationResponse {
  text: string;
  retryDelay?: number; // שניות להמתנה אם חזר 429
}

const buildPrompt = (courses: Course[]): string => {
  let prompt =
    'על בסיס הרציונלים של הקורסים הבאים, נסח 2-4 משפטים בלבד המבטאים חיבורים אינטלקטואליים, רעיוניים או יישומיים אפשריים בין תחומי הדעת שלהם. הקפד על שפה אקדמית רהוטה וקצרה.\n\n';

  courses.forEach((course, index) => {
    prompt += `--- קורס ${index + 1} ---\n`;
    prompt += `שם הקורס: ${course.CourseName}\n`;
    prompt += `רציונל ותקציר: ${course.RationaleAbstract}\n\n`;
  });

  return prompt;
};

export const generateIntegration = async (courses: Course[]): Promise<IntegrationResponse> => {
  if (!Array.isArray(courses) || courses.length < 2 || courses.length > 4) {
    throw new Error('Number of courses must be between 2 and 4.');
  }

  const prompt = buildPrompt(courses);

  const resp = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  // הצלחה רגילה
  if (resp.ok) {
    const data = await resp.json();
    const text = (data?.text ?? '').toString();
    return { text };
  }

  // 429 – שרת החזיר Retry-After (וגם body עם retryDelay)
  if (resp.status === 429) {
    const retryAfterHeader = resp.headers.get('Retry-After');
    let retryDelay = retryAfterHeader ? Number(retryAfterHeader) : undefined;

    try {
      const data = await resp.json().catch(() => null);
      if (!retryDelay && data?.retryDelay) {
        retryDelay = Number(data.retryDelay);
      }
    } catch {
      // מתעלמים מקריאת JSON כושלת
    }

    return { text: '', retryDelay: retryDelay && retryDelay > 0 ? retryDelay : 20 };
  }

  // שגיאה אחרת – זריקת שגיאה כללית
  let serverMsg = '';
  try {
    const errData = await resp.json();
    serverMsg = errData?.error || '';
  } catch {
    /* ignore */
  }
  throw new Error(serverMsg || `Failed to generate integrations from server (status ${resp.status}).`);
};
