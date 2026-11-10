import { normalizeFieldName, calculateStringSimilarity } from '../excel/dataNormalizer';

/**
 * Finds the best matching <option> in a <select> element for a given target value.
 */
export function findBestSelectOption(
  selectEl: HTMLSelectElement,
  targetValue: string | number | boolean | null | undefined
): HTMLOptionElement | null {
  if (targetValue === null || targetValue === undefined) return null;
  const targetStr = String(targetValue).trim();
  if (!targetStr) return null;

  const normTarget = normalizeFieldName(targetStr);
  const options = Array.from(selectEl.options);

  if (options.length === 0) return null;

  // 1. Direct exact value or text match
  for (const opt of options) {
    if (opt.value === targetStr || opt.text.trim() === targetStr) {
      return opt;
    }
  }

  // 2. Normalized lowercase match
  for (const opt of options) {
    const normVal = normalizeFieldName(opt.value);
    const normText = normalizeFieldName(opt.text);
    if (normVal === normTarget || normText === normTarget) {
      return opt;
    }
  }

  // 3. Containment match (e.g. "Male" in "Male (cisgender)", "B.E" in "Bachelor of Engineering (B.E)")
  for (const opt of options) {
    const normVal = normalizeFieldName(opt.value);
    const normText = normalizeFieldName(opt.text);
    if (
      (normText.length > 0 && (normText.includes(normTarget) || normTarget.includes(normText))) ||
      (normVal.length > 0 && (normVal.includes(normTarget) || normTarget.includes(normVal)))
    ) {
      return opt;
    }
  }

  // 4. Fuzzy similarity match
  let bestOpt: HTMLOptionElement | null = null;
  let highestScore = 0;

  for (const opt of options) {
    if (!opt.value && !opt.text) continue;
    const valSim = calculateStringSimilarity(normTarget, opt.value);
    const textSim = calculateStringSimilarity(normTarget, opt.text);
    const maxScore = Math.max(valSim, textSim);

    if (maxScore > highestScore && maxScore > 0.6) {
      highestScore = maxScore;
      bestOpt = opt;
    }
  }

  return bestOpt;
}
