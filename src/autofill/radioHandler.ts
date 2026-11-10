import { extractElementLabel } from '../matching/fieldDetector';
import { normalizeFieldName, calculateStringSimilarity } from '../excel/dataNormalizer';

/**
 * Finds the correct radio button element within a group for a given Excel value.
 */
export function findMatchingRadioButton(
  container: HTMLElement | Document,
  groupName: string,
  targetValue: string | number | boolean | null | undefined
): HTMLInputElement | null {
  if (targetValue === null || targetValue === undefined) return null;
  const targetStr = String(targetValue).trim();
  if (!targetStr) return null;

  const normTarget = normalizeFieldName(targetStr);
  const radios = Array.from(
    container.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(groupName)}"]`)
  );

  if (radios.length === 0) return null;

  // 1. Direct value match
  for (const radio of radios) {
    if (radio.value.toLowerCase() === targetStr.toLowerCase()) {
      return radio;
    }
  }

  // 2. Normalized label match
  for (const radio of radios) {
    const label = extractElementLabel(radio, container);
    const normLabel = normalizeFieldName(label);
    if (normLabel === normTarget) {
      return radio;
    }
  }

  // 3. Containment match
  for (const radio of radios) {
    const label = extractElementLabel(radio, container);
    const normLabel = normalizeFieldName(label);
    const normVal = normalizeFieldName(radio.value);
    if (
      (normLabel && (normLabel.includes(normTarget) || normTarget.includes(normLabel))) ||
      (normVal && (normVal.includes(normTarget) || normTarget.includes(normVal)))
    ) {
      return radio;
    }
  }

  // 4. Fuzzy similarity match
  let bestRadio: HTMLInputElement | null = null;
  let highestSim = 0;

  for (const radio of radios) {
    const label = extractElementLabel(radio, container);
    const normLabel = normalizeFieldName(label);
    const sim = calculateStringSimilarity(normTarget, normLabel || radio.value);
    if (sim > highestSim && sim > 0.6) {
      highestSim = sim;
      bestRadio = radio;
    }
  }

  return bestRadio;
}
