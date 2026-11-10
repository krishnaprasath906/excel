/**
 * Google Forms entry ID mapping and URL generator for forms.gle/fD4sCK9HbiGSEA6g9
 */

export const GOOGLE_FORM_SHORT_URL = 'https://forms.gle/fD4sCK9HbiGSEA6g9';
export const GOOGLE_FORM_BASE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScqJ726Y2y5dRrgNtLbXxk6XQ_SVBb_yIf4ze-gohGQoPNwYA/viewform';

export const GOOGLE_FORM_ENTRY_IDS: Record<string, string> = {
  'Registration Number': 'entry.231163706',
  'Name': 'entry.1292037802',
  'Email Address': 'entry.546298497',
  'Middle Initial': 'entry.181887579',
  'Blood Group': 'entry.504162545',
  'Age': 'entry.495479887',
  'Mobile Number': 'entry.1864988301',
  'Weight in Kgs.': 'entry.1966158721',
  'Gender': 'entry.128164203',
  'Degree': 'entry.413957845',
  'Institute': 'entry.122869881',
  'Stream': 'entry.1311947288',
  'Register joining code': 'entry.1326022215',
  'Age in Company (Years)': 'entry.1443993115',
  'Work Experience': 'entry.660743133',
  'Current City': 'entry.1215550517',
  'Region': 'entry.697404150',
};

export function generatePreFilledGoogleFormUrl(
  personDetails: Record<string, any>,
  customUrl?: string
): string {
  let baseUrl = GOOGLE_FORM_BASE_URL;
  if (customUrl && customUrl.includes('docs.google.com/forms/d/e/')) {
    baseUrl = customUrl.split('?')[0];
  }

  const url = new URL(baseUrl);
  url.searchParams.set('usp', 'pp_url');

  for (const [key, entryId] of Object.entries(GOOGLE_FORM_ENTRY_IDS)) {
    // Find matching key in person details (case-insensitive & trimmed)
    const matchKey = Object.keys(personDetails).find(
      (k) => k.trim().toLowerCase() === key.trim().toLowerCase()
    );

    if (matchKey && personDetails[matchKey] !== undefined && personDetails[matchKey] !== null) {
      url.searchParams.set(entryId, String(personDetails[matchKey]));
    }
  }

  return url.toString();
}
