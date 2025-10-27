import React, { useEffect, useRef, useState } from 'react';
import { Course } from '../types';
import { generateIntegration } from '../services/geminiService';
import type { IntegrationResponse } from '../services/geminiService';
import XCircleIcon from './icons/XCircleIcon';

interface IntegrationsEngineProps {
  selectedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

const IntegrationsEngine: React.FC<IntegrationsEngineProps> = ({
  selectedCourses,
  onRemoveCourse,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  // מצב ל-429
  const [retryDelay, setRetryDelay] = useState<number | null>(null); // כמה שניות לחכות
  const [countdown, setCountdown] = useState<number | null>(null); // טיימר יורד

  // מצביעים לניקוי אינטרוול/טיים-אאוט
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canGenerate = selectedCourses.length >= 2 && selectedCourses.length <= 4;

  /** ניקוי טיימרים כשמריצים בקשה חדשה או כשהקומפוננטה מתפרקת */
  const clearTimers = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers(); // ניקוי בהשמדה
  }, []);

  /** מפעיל טיימר יורד ויוזם ניסיון חוזר אוטומטי */
  const scheduleRetry = (delaySecs: number, attempt: number) => {
    const delay = Math.max(1, Math.ceil(delaySecs));
    setRetryDelay(delay);
    setCountdown(delay);

    // טיימר יורד כל שנייה
    clearTimers();
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        const next = (prev ?? 0) - 1;
        if (next <= 0) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    // ניסיון חוזר כשמסתיים הזמן
    retryTimeoutRef.current = setTimeout(async () => {
      await attemptGenerate(attempt + 1);
    }, delay * 1000);
  };

  /** ניסיון לייצר אינטגרציה; מטפל גם ב-429 עם חזרות מרובות */
  const attemptGenerate = async (attempt: number = 1) => {
    try {
      const response: IntegrationResponse = await generateIntegration(selectedCourses);

      if (response.retryDelay) {
        // קיבלנו 429 — נתזמן ניסיון חוזר
        scheduleRetry(response.retryDelay, attempt);
        return;
      }

      // הצלחה — מציגים תוצאה
      setResult(response.text);
      setRetryDelay(null);
      setCountdown(null);
      clearTimers();
      setIsLoading(false);
    } catch (err) {
      // שגיאה שאינה 429
      console.error(err);
      setError('אירעה שגיאה ביצירת החיבורים. אנא נסה שוב מאוחר יותר.');
      clearTimers();
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    // איפוס מצב
    setIsLoading(true);
    setError(null);
    setResult('');
    setRetryDelay(null);
    setCountdown(null);
    clearTimers();

    await attemptGenerate(1);
  };

  // חישוב אחוז לפס ההתקדמות (מ-100% ל-0%)
  const progressPercent =
    retryDelay && countdown !== null && retryDelay > 0
      ? Math.max(0, Math.min(100, Math.round((countdown / retryDelay) * 100)))
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">מנוע אינטגרציות גנרטיבי</h2>
        <p className="mt-2 text-gray-600 md:text-lg">
          בחר 2 עד 4 קורסים מהקטלוג כדי לגלות חיבורים רעיוניים, אינטלקטואליים ויישומיים ביניהם.
        </p>
      </div>

      {/* רשימת קורסים */}
      <div className="bg-gray-50 p-4 rounded-md min-h-[150px]">
        <h3 className="font-semibold text-gray-700 mb-3 md:text-lg">קורסים שנבחרו:</h3>
        {selectedCourses.length === 0 ? (
          <p className="text-center text-gray-500 py-8 md:text-lg">
            לא נבחרו קורסים. חזור לקטלוג כדי לבחור.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCourses.map((course) => {
              const displayName = course.CourseFormat?.includes('מקוון')
                ? `@ ${course.CourseName}`
                : course.CourseName;
              return (
                <div
                  key={course.CourseID}
                  className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-blue-700 md:text-lg">{displayName}</p>
                    <p className="text-sm md:text-base text-gray-500">
                      {course.LecturerName?.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course.CourseID)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="הסר קורס"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* כפתור הפעלה */}
      <div className="text-center mt-6">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isLoading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 md:text-lg"
        >
          {isLoading ? 'יוצר חיבורים...' : 'מצא חיבורים רעיוניים'}
        </button>
        {!canGenerate && selectedCourses.length > 0 && (
          <p className="text-sm text-yellow-600 mt-2">
            יש לבחור 2-4 קורסים על מנת להפיק חיבורים.
          </p>
        )}
      </div>

      {/* מצב טעינה, שגיאה ותוצאה */}
      <div className="mt-8">
        {isLoading && (
          <div
            className="flex justify-center items-center flex-col text-center"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="mt-4 text-gray-600 md:text-lg">
              הבינה המלאכותית חושבת... תהליך זה עשוי לקחת מספר רגעים.
            </p>

            {/* הודעת Rate Limit + טיימר ופס התקדמות */}
            {retryDelay !== null && (
              <>
                <p className="mt-2 text-yellow-600 md:text-lg font-medium">
                  ⚠️ המערכת עמוסה כרגע.
                  <br />
                  ניסיון נוסף יתבצע בעוד{' '}
                  <span className="tabular-nums">
                    {countdown ?? retryDelay}
                  </span>{' '}
                  שניות...
                </p>

                <div className="w-64 bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-2 transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                    aria-label="התקדמות עד לניסיון הבא"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 rounded-md md:text-lg mt-4">
            <p className="font-bold">שגיאה</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded-lg shadow-inner mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-4">אינטגרציות מוצעות</h3>
            {/* שומרים על מעברי שורה מהמודל */}
            <div className="prose prose-lg md:prose-xl text-gray-800 whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsEngine;
