/**
 * Utility functions for normalizing field names, text, and values for robust matching.
 */

export function normalizeFieldName(input: string): string {
  if (!input) return '';
  
  return input
    .toLowerCase()
    .trim()
    // Remove common parenthetical units like (Years), (Kgs), (in Kgs.), (kg), etc.
    .replace(/\s*\([^)]*\)/g, '')
    // Remove punctuation & special characters except spaces
    .replace(/[._\-:/\\#&,]/g, ' ')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined' || str.toLowerCase() === 'n/a') {
    return '';
  }
  return str;
}

export function tokenize(str: string): string[] {
  const norm = normalizeFieldName(str);
  return norm.split(' ').filter(token => token.length > 0);
}

export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeFieldName(str1);
  const s2 = normalizeFieldName(str2);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const distance = calculateLevenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);

  if (maxLength === 0) return 1.0;

  return Math.max(0, (maxLength - distance) / maxLength);
}
