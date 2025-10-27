import { Course } from '../types';
import { GOOGLE_SHEET_CSV_URL } from '../constants';

// Make PapaParse available from the window object, as it's loaded from a CDN.
declare global {
  interface Window {
    Papa: any;
  }
}

/**
 * Converts a standard Google Drive sharing URL to a direct, embeddable thumbnail URL.
 * This is a more reliable method for embedding images than the 'uc?export=view' link.
 * e.g., from: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * to: https://drive.google.com/thumbnail?id=FILE_ID
 * @param url The original URL.
 * @returns The converted URL, or the original if it's not a Google Drive link.
 */
const convertGoogleDriveUrl = (url: string): string => {
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/thumbnail?id=${fileId}`;
  }
  return url;
};


export const fetchCourses = (): Promise<Course[]> => {
  return new Promise((resolve, reject) => {
    if (!window.Papa) {
      return reject(new Error('PapaParse library is not loaded.'));
    }

    window.Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.errors.length) {
          console.error("Errors parsing CSV:", results.errors);
          reject(new Error('Failed to parse the Google Sheet CSV. Check console for details.'));
        } else {
          // Ensure data conforms to the Course type.
          const courses: Course[] = results.data.map((row: any) => {
            const primaryLecturers = (row.LecturerName || '').split(',').map((name: string) => name.trim()).filter(Boolean);
            const secondaryLecturers = (row.LecturerSecondary || '').split(',').map((name: string) => name.trim()).filter(Boolean);
            
            // Case-insensitive key finding for the image URL column
            const imageUrlKey = Object.keys(row).find(key => key.toLowerCase() === 'image_url');
            const imageUrlString = imageUrlKey ? (row[imageUrlKey] || '') : '';
            const rawUrls = imageUrlString.split(',').map((url: string) => url.trim()).filter(Boolean);

            return {
              CourseID: row.CourseID || `${Date.now()}-${Math.random()}`, // Assign a unique ID if missing
              CourseName: (row.CourseName || 'N/A').trim(),
              LecturerName: [...primaryLecturers, ...secondaryLecturers],
              LecturerImageURL: rawUrls.map(convertGoogleDriveUrl),
              SemesterPrimary: (row.SemesterPrimary || 'N/A').trim(),
              SemesterSecondary: (row.SemesterSecondary || '').trim(),
              CourseFormat: (row.CourseFormat || 'N/A').trim(),
              RationaleAbstract: (row.RationaleAbstract || '').trim(),
              CourseGoals: (row.CourseGoals || '').trim(),
              AssessmentMethods: (row.AssessmentMethods || '').trim(),
              LearningOutcomes: (row.LearningOutcomes || '').trim(),
              AIIntegration: (row.AIIntegration || '').trim(),
              CourseConnections: (row.CourseConnections || '').trim(),
            }
          });
          resolve(courses.filter(c => c.CourseName !== 'N/A'));
        }
      },
      error: (error: any) => {
        console.error("Network or parsing error:", error);
        reject(new Error('Failed to fetch or parse the Google Sheet. Check network connection and URL.'));
      },
    });
  });
};