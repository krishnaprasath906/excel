export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'unknown';

export interface ExcelRow {
  [columnName: string]: string | number | boolean | null | undefined;
}

export interface ExcelParseResult {
  fileName: string;
  fileSize: number;
  totalRows: number;
  columns: string[];
  regNumberColumn: string;
  data: ExcelRow[];
  timestamp: number;
}

export interface PersonRecord {
  regNumber: string;
  fullName?: string;
  email?: string;
  rawDetails: Record<string, string | number | boolean | null | undefined>;
}

export interface DetectedFormField {
  id: string;
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  ariaLabel?: string;
  selector: string;
  options?: Array<{ value: string; label: string }>;
  radioValues?: Array<{ value: string; label: string; elementSelector: string }>;
  required?: boolean;
  currentValue?: string;
  contextText?: string;
}

export type MatchConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

export interface FieldMapping {
  excelField: string;
  excelValue: string | number | boolean | null | undefined;
  formFieldId: string | null;
  formFieldLabel: string | null;
  formFieldSelector: string | null;
  formFieldType: FormFieldType | null;
  confidence: number; // 0 - 100
  confidenceLevel: MatchConfidenceLevel;
  status: 'matched' | 'review' | 'manual' | 'unmapped' | 'invalid';
  validationMessage?: string;
  isCustomOverride?: boolean;
}

export interface AutofillPlan {
  person: PersonRecord;
  targetUrl: string;
  targetDomain: string;
  mappings: FieldMapping[];
  detectedFieldsCount: number;
  mappedFieldsCount: number;
  overallConfidence: number;
}

export interface AutofillResult {
  success: boolean;
  totalFields: number;
  filledFields: number;
  skippedFields: number;
  fieldResults: Array<{
    field: string;
    targetField: string;
    value: string;
    success: boolean;
    error?: string;
  }>;
  timestamp: string;
}

export interface SavedDomainMapping {
  domain: string;
  lastUpdated: string;
  mappings: Record<string, string>; // excelField -> formFieldSelector/identifier
}

export interface AutofillHistoryItem {
  id: string;
  regNumber: string;
  personName: string;
  targetDomain: string;
  targetUrl: string;
  fieldsFilledCount: number;
  totalFieldsCount: number;
  status: 'Completed' | 'Partial' | 'Failed';
  timestamp: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}
