import * as XLSX from 'xlsx';
import { ExcelParseResult, ExcelRow, PersonRecord } from '../types/index';
import { normalizeFieldName, cleanValue } from './dataNormalizer';

// List of possible names for the Registration Number column
export const REGISTRATION_COLUMN_CANDIDATES = [
  'registration number',
  'registration no',
  'reg number',
  'reg no',
  'regno',
  'registration_number',
  'reg_no',
  'registration #',
  'reg #',
  'roll number',
  'roll no',
  'candidate id',
  'student id',
  'employee id',
  'emp id',
  'id number',
];

export function findRegistrationColumn(columns: string[]): string | null {
  for (const col of columns) {
    const norm = normalizeFieldName(col);
    if (REGISTRATION_COLUMN_CANDIDATES.some(cand => norm === cand || norm.includes(cand))) {
      return col;
    }
  }
  return null;
}

export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Could not read file content.');
        }

        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('The uploaded Excel workbook contains no sheets.');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('The uploaded Excel sheet is empty.');
        }

        // Extract column names from first object or sheet headers
        const columns: string[] = Object.keys(rawJson[0]);

        if (columns.length === 0) {
          throw new Error('No valid header columns detected in the Excel sheet.');
        }

        const regCol = findRegistrationColumn(columns);
        if (!regCol) {
          throw new Error(
            `Missing Registration Number column. Please ensure your Excel sheet has a column named "Registration Number", "Reg No", or similar.`
          );
        }

        // Clean and format all rows
        const cleanedData: ExcelRow[] = rawJson.map(row => {
          const cleanRow: ExcelRow = {};
          for (const key of columns) {
            cleanRow[key] = cleanValue(row[key]);
          }
          return cleanRow;
        });

        resolve({
          fileName: file.name,
          fileSize: file.size,
          totalRows: cleanedData.length,
          columns,
          regNumberColumn: regCol,
          data: cleanedData,
          timestamp: Date.now(),
        });
      } catch (err: any) {
        reject(new Error(err?.message || 'Failed to parse Excel file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function searchPersonByRegistrationNumber(
  excelResult: ExcelParseResult,
  queryRegNumber: string
): PersonRecord | null {
  if (!excelResult || !excelResult.data || !excelResult.regNumberColumn) {
    return null;
  }

  const queryTrimmed = queryRegNumber.trim().toLowerCase();
  if (!queryTrimmed) return null;

  const regCol = excelResult.regNumberColumn;

  // Find candidate name column
  const nameCol = excelResult.columns.find(c => {
    const n = normalizeFieldName(c);
    return n === 'name' || n === 'full name' || n === 'candidate name' || n === 'student name' || n === 'person name' || n.includes('name');
  });

  // 1. Exact registration match
  let matchedRow = excelResult.data.find(row => {
    const val = cleanValue(row[regCol]).toLowerCase();
    return val === queryTrimmed;
  });

  // 2. Partial registration match if exact fails
  if (!matchedRow) {
    matchedRow = excelResult.data.find(row => {
      const val = cleanValue(row[regCol]).toLowerCase();
      return val.includes(queryTrimmed);
    });
  }

  // 3. Fallback to name search
  if (!matchedRow && nameCol) {
    matchedRow = excelResult.data.find(row => {
      const val = cleanValue(row[nameCol]).toLowerCase();
      return val === queryTrimmed || val.includes(queryTrimmed);
    });
  }

  if (!matchedRow) {
    return null;
  }

  // Find candidate email column
  const emailCol = excelResult.columns.find(c => {
    const n = normalizeFieldName(c);
    return n.includes('email') || n.includes('mail');
  });

  return {
    regNumber: cleanValue(matchedRow[regCol]),
    fullName: nameCol ? cleanValue(matchedRow[nameCol]) : undefined,
    email: emailCol ? cleanValue(matchedRow[emailCol]) : undefined,
    rawDetails: matchedRow,
  };
}
