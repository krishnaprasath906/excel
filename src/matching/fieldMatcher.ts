import { DetectedFormField, FieldMapping, MatchConfidenceLevel, PersonRecord } from '../types';
import { normalizeFieldName, calculateStringSimilarity, tokenize, cleanValue } from '../excel/dataNormalizer';
import { getCanonicalConcept } from './synonyms';

/**
 * Calculates a confidence score (0 to 100) between an Excel column name and a detected form field.
 */
export function calculateFieldScore(
  excelCol: string,
  formField: DetectedFormField
): { score: number; reason: string } {
  const normExcel = normalizeFieldName(excelCol);
  const normLabel = normalizeFieldName(formField.label);
  const normName = normalizeFieldName(formField.name);
  const normId = normalizeFieldName(formField.id);
  const normPlaceholder = normalizeFieldName(formField.placeholder || '');
  const normAria = normalizeFieldName(formField.ariaLabel || '');

  // 1. Direct exact match with label, name, or id
  if (normExcel === normLabel && normLabel.length > 0) {
    return { score: 100, reason: 'Exact label match' };
  }
  if (normExcel === normName && normName.length > 0) {
    return { score: 98, reason: 'Exact field name match' };
  }
  if (normExcel === normId && normId.length > 0) {
    return { score: 96, reason: 'Exact element ID match' };
  }
  if (normExcel === normPlaceholder && normPlaceholder.length > 0) {
    return { score: 95, reason: 'Exact placeholder match' };
  }
  if (normExcel === normAria && normAria.length > 0) {
    return { score: 95, reason: 'Exact aria-label match' };
  }

  // 2. Canonical concept match using synonyms dictionary
  const excelConcept = getCanonicalConcept(excelCol);
  const labelConcept = getCanonicalConcept(formField.label);
  const nameConcept = getCanonicalConcept(formField.name);
  const idConcept = getCanonicalConcept(formField.id);
  const placeholderConcept = getCanonicalConcept(formField.placeholder || '');

  if (excelConcept) {
    if (excelConcept === labelConcept) {
      return { score: 94, reason: `Synonym concept match: ${excelConcept}` };
    }
    if (excelConcept === nameConcept) {
      return { score: 92, reason: `Synonym field name match: ${excelConcept}` };
    }
    if (excelConcept === idConcept) {
      return { score: 91, reason: `Synonym field ID match: ${excelConcept}` };
    }
    if (excelConcept === placeholderConcept) {
      return { score: 90, reason: `Synonym placeholder match: ${excelConcept}` };
    }
  }

  // 3. Token containment and fuzzy string similarity
  const excelTokens = tokenize(excelCol);
  const labelTokens = tokenize(formField.label);
  const nameTokens = tokenize(formField.name);

  // Check if all tokens of one are present in the other
  const allExcelInLabel = excelTokens.length > 0 && excelTokens.every(t => labelTokens.includes(t) || normLabel.includes(t));
  const allLabelInExcel = labelTokens.length > 0 && labelTokens.every(t => excelTokens.includes(t) || normExcel.includes(t));

  if (allExcelInLabel || allLabelInExcel) {
    return { score: 88, reason: 'Complete token overlap' };
  }

  // Partial token overlap
  const sharedLabelTokens = excelTokens.filter(t => labelTokens.includes(t) || nameTokens.includes(t));
  if (sharedLabelTokens.length > 0) {
    const overlapRatio = (sharedLabelTokens.length * 2) / (excelTokens.length + labelTokens.length);
    const score = Math.round(70 + overlapRatio * 18); // 70 to 88
    return { score: Math.min(88, score), reason: `Partial token overlap (${sharedLabelTokens.join(', ')})` };
  }

  // 4. Levenshtein fuzzy string similarity across all signals
  const labelSim = calculateStringSimilarity(normExcel, normLabel);
  const nameSim = calculateStringSimilarity(normExcel, normName);
  const idSim = calculateStringSimilarity(normExcel, normId);
  const placeholderSim = calculateStringSimilarity(normExcel, normPlaceholder);

  const maxSim = Math.max(labelSim, nameSim, idSim, placeholderSim);

  if (maxSim >= 0.85) {
    return { score: Math.round(maxSim * 95), reason: `High fuzzy similarity (${Math.round(maxSim * 100)}%)` };
  } else if (maxSim >= 0.70) {
    return { score: Math.round(maxSim * 90), reason: `Medium fuzzy similarity (${Math.round(maxSim * 100)}%)` };
  } else if (maxSim >= 0.50) {
    return { score: Math.round(maxSim * 80), reason: `Low fuzzy similarity (${Math.round(maxSim * 100)}%)` };
  }

  // 5. Fallback context inspection
  if (formField.contextText) {
    const normContext = normalizeFieldName(formField.contextText);
    if (normContext.includes(normExcel) && normExcel.length > 3) {
      return { score: 65, reason: 'Nearby contextual text match' };
    }
  }

  return { score: 0, reason: 'No significant match found' };
}

/**
 * Creates optimal field mappings between Excel columns and detected form fields.
 */
export function matchFields(
  excelColumns: string[],
  detectedFormFields: DetectedFormField[],
  person: PersonRecord,
  savedMappings?: Record<string, string>
): FieldMapping[] {
  const mappings: FieldMapping[] = [];
  const usedFormFieldIds = new Set<string>();

  // Process saved/custom overrides first if available
  if (savedMappings) {
    for (const excelCol of excelColumns) {
      const savedTargetId = savedMappings[excelCol];
      if (savedTargetId) {
        const targetField = detectedFormFields.find(
          f => f.id === savedTargetId || f.name === savedTargetId || f.selector === savedTargetId
        );
        if (targetField) {
          usedFormFieldIds.add(targetField.id);
          mappings.push({
            excelField: excelCol,
            excelValue: person.rawDetails[excelCol],
            formFieldId: targetField.id,
            formFieldLabel: targetField.label || targetField.name,
            formFieldSelector: targetField.selector,
            formFieldType: targetField.type,
            confidence: 100,
            confidenceLevel: 'high',
            status: 'matched',
            validationMessage: 'Loaded from saved domain mapping',
            isCustomOverride: true,
          });
        }
      }
    }
  }

  // Match remaining Excel columns
  for (const excelCol of excelColumns) {
    // Skip if already mapped via saved preferences
    if (mappings.some(m => m.excelField === excelCol)) {
      continue;
    }

    let bestField: DetectedFormField | null = null;
    let bestScore = 0;
    let bestReason = '';

    for (const formField of detectedFormFields) {
      // Prioritize unused form fields
      if (usedFormFieldIds.has(formField.id)) {
        continue;
      }

      const { score, reason } = calculateFieldScore(excelCol, formField);
      if (score > bestScore) {
        bestScore = score;
        bestField = formField;
        bestReason = reason;
      }
    }

    let confidenceLevel: MatchConfidenceLevel = 'none';
    let status: FieldMapping['status'] = 'unmapped';

    if (bestScore >= 90) {
      confidenceLevel = 'high';
      status = 'matched';
    } else if (bestScore >= 75) {
      confidenceLevel = 'medium';
      status = 'review';
    } else if (bestScore > 0) {
      confidenceLevel = 'low';
      status = 'manual';
    }

    if (bestField && bestScore >= 60) {
      usedFormFieldIds.add(bestField.id);
      mappings.push({
        excelField: excelCol,
        excelValue: person.rawDetails[excelCol],
        formFieldId: bestField.id,
        formFieldLabel: bestField.label || bestField.name,
        formFieldSelector: bestField.selector,
        formFieldType: bestField.type,
        confidence: bestScore,
        confidenceLevel,
        status,
        validationMessage: bestReason,
        isCustomOverride: false,
      });
    } else {
      mappings.push({
        excelField: excelCol,
        excelValue: person.rawDetails[excelCol],
        formFieldId: null,
        formFieldLabel: null,
        formFieldSelector: null,
        formFieldType: null,
        confidence: 0,
        confidenceLevel: 'none',
        status: 'unmapped',
        validationMessage: 'No corresponding form field detected automatically',
        isCustomOverride: false,
      });
    }
  }

  return mappings;
}
