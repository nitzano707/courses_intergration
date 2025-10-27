// constants.ts
// -----------------------------------------------------------
// Converts a regular Google Sheets URL into a valid CSV export URL.
// Example input:
// https://docs.google.com/spreadsheets/d/1abcXYZ123/edit?gid=987654321#gid=987654321
// Example output:
// https://docs.google.com/spreadsheets/d/1abcXYZ123/export?format=csv&gid=987654321
// -----------------------------------------------------------

/**
 * Converts a Google Sheets URL (edit/view) to a direct CSV export URL.
 * @param url - The pasted Google Sheets URL.
 * @returns The corresponding CSV export URL.
 */
export function convertSheetUrlToCsv(url: string): string {
  try {
    if (!url.includes("docs.google.com/spreadsheets/d/")) {
      throw new Error("The provided URL is not a valid Google Sheets link.");
    }

    const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = url.match(/gid=(\d+)/);

    if (!idMatch) throw new Error("Sheet ID not found in the URL.");

    const sheetId = idMatch[1];
    const gid = gidMatch ? gidMatch[1] : "0";

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  } catch (error) {
    console.error("Invalid Google Sheet URL:", error);
    return "";
  }
}

// -----------------------------------------------------------
// Example usage:
// Paste your Google Sheets URL here and get the CSV export link.
// -----------------------------------------------------------

const pastedUrl =
  "https://docs.google.com/spreadsheets/d/1jSROElRVDaHO8In0Goab6xJ46jWgI-BRS3ZRAymeXtg/edit?gid=1091734925#gid=1091734925";

export const GOOGLE_SHEET_CSV_URL = convertSheetUrlToCsv(pastedUrl);
