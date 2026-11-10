import { FieldMapping, ValidationResult } from '../types';

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function validateNumeric(val: unknown): boolean {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num);
}

export function validateFieldMapping(mapping: FieldMapping): ValidationResult {
  const value = mapping.excelValue !== null && mapping.excelValue !== undefined ? String(mapping.excelValue).trim() : '';

  if (!mapping.formFieldId && !mapping.formFieldSelector) {
    return {
      isValid: false,
      warning: 'Field is currently unmapped.',
    };
  }

  if (!value) {
    return {
      isValid: true,
      warning: 'Excel value for this field is blank.',
    };
  }

  const fieldLower = mapping.excelField.toLowerCase();

  // Email validation
  if (fieldLower.includes('email') || mapping.formFieldType === 'email') {
    if (!validateEmail(value)) {
      return {
        isValid: false,
        error: `"${value}" is not a valid email format.`,
      };
    }
  }

  // Age validation
  if (fieldLower.includes('age') && !fieldLower.includes('company')) {
    if (!validateNumeric(value) || Number(value) < 1 || Number(value) > 125) {
      return {
        isValid: false,
        error: `Age "${value}" must be a valid number between 1 and 125.`,
      };
    }
  }

  // Weight validation
  if (fieldLower.includes('weight')) {
    if (!validateNumeric(value) || Number(value) < 10 || Number(value) > 400) {
      return {
        isValid: false,
        error: `Weight "${value}" must be a valid numeric weight.`,
      };
    }
  }

  // Phone / Mobile validation
  if (fieldLower.includes('mobile') || fieldLower.includes('phone') || mapping.formFieldType === 'tel') {
    if (!validatePhoneNumber(value)) {
      return {
        isValid: true,
        warning: `Phone number "${value}" may have unusual formatting.`,
      };
    }
  }

  return { isValid: true };
}
