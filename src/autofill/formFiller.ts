import { AutofillResult, FieldMapping } from '../types';
import { findBestSelectOption } from './dropdownHandler';
import { findMatchingRadioButton } from './radioHandler';

/**
 * Safely sets the value of an input element and dispatches events so that
 * React, Vue, Angular, and Next.js reactive state handlers trigger properly.
 */
export function setFrameworkInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  // Focus first
  element.focus();

  // Handle React's _valueTracker if present
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

  if (descriptor && descriptor.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  // Dispatch events with full bubbling
  element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
}

/**
 * Applies a visual highlight animation to the filled element to inform the user.
 */
export function highlightElement(element: HTMLElement): void {
  element.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50/50', 'transition-all', 'duration-500');
  setTimeout(() => {
    element.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50/50');
  }, 2500);
}

/**
 * Executes autofill across a target container or document based on confirmed field mappings.
 * Strictly adheres to the rule: NEVER trigger form submission.
 */
export function executeAutofill(
  container: HTMLElement | Document,
  mappings: FieldMapping[]
): AutofillResult {
  const fieldResults: AutofillResult['fieldResults'] = [];
  let filledCount = 0;
  let skippedCount = 0;

  for (const mapping of mappings) {
    // Skip unmapped or empty values
    if (!mapping.formFieldSelector && !mapping.formFieldId) {
      skippedCount++;
      continue;
    }

    const value = mapping.excelValue !== null && mapping.excelValue !== undefined ? String(mapping.excelValue) : '';
    if (!value.trim()) {
      skippedCount++;
      fieldResults.push({
        field: mapping.excelField,
        targetField: mapping.formFieldLabel || 'Unmapped',
        value: '',
        success: false,
        error: 'Excel value was blank',
      });
      continue;
    }

    try {
      // Find element by selector or id
      let element: HTMLElement | null = null;
      if (mapping.formFieldSelector) {
        element = container.querySelector(mapping.formFieldSelector);
      }
      if (!element && mapping.formFieldId) {
        element = container.querySelector(`#${CSS.escape(mapping.formFieldId)}`);
      }

      if (!element && mapping.formFieldType === 'radio') {
        // Find radio group by name
        const groupName = mapping.formFieldId || '';
        const radio = findMatchingRadioButton(container, groupName, value);
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          radio.dispatchEvent(new Event('input', { bubbles: true }));
          highlightElement(radio.parentElement || radio);
          filledCount++;
          fieldResults.push({
            field: mapping.excelField,
            targetField: mapping.formFieldLabel || groupName,
            value,
            success: true,
          });
          continue;
        } else {
          fieldResults.push({
            field: mapping.excelField,
            targetField: mapping.formFieldLabel || groupName,
            value,
            success: false,
            error: `No matching radio button option found for "${value}"`,
          });
          continue;
        }
      }

      if (!element) {
        fieldResults.push({
          field: mapping.excelField,
          targetField: mapping.formFieldLabel || mapping.excelField,
          value,
          success: false,
          error: 'Form field element could not be found in DOM',
        });
        continue;
      }

      const tagName = element.tagName.toLowerCase();

      // 1. SELECT Dropdown
      if (tagName === 'select' && element instanceof HTMLSelectElement) {
        const matchingOption = findBestSelectOption(element, value);
        if (matchingOption) {
          element.value = matchingOption.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('input', { bubbles: true }));
          highlightElement(element);
          filledCount++;
          fieldResults.push({
            field: mapping.excelField,
            targetField: mapping.formFieldLabel || element.name,
            value: matchingOption.text,
            success: true,
          });
        } else {
          fieldResults.push({
            field: mapping.excelField,
            targetField: mapping.formFieldLabel || element.name,
            value,
            success: false,
            error: `Value "${value}" does not match any dropdown options`,
          });
        }
        continue;
      }

      // 2. CHECKBOX
      if (element instanceof HTMLInputElement && element.type === 'checkbox') {
        const isTrue = ['true', 'yes', '1', 'y', 'checked', 'active'].includes(value.toLowerCase());
        element.checked = isTrue;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        highlightElement(element);
        filledCount++;
        fieldResults.push({
          field: mapping.excelField,
          targetField: mapping.formFieldLabel || element.name,
          value: isTrue ? 'Checked' : 'Unchecked',
          success: true,
        });
        continue;
      }

      // 3. TEXT, EMAIL, NUMBER, TEL, TEXTAREA
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        setFrameworkInputValue(element, value);
        highlightElement(element);
        filledCount++;
        fieldResults.push({
          field: mapping.excelField,
          targetField: mapping.formFieldLabel || element.name || element.id,
          value,
          success: true,
        });
        continue;
      }

      fieldResults.push({
        field: mapping.excelField,
        targetField: mapping.formFieldLabel || mapping.excelField,
        value,
        success: false,
        error: `Unsupported element type: <${tagName}>`,
      });
    } catch (err: any) {
      fieldResults.push({
        field: mapping.excelField,
        targetField: mapping.formFieldLabel || mapping.excelField,
        value,
        success: false,
        error: err?.message || 'Autofill error',
      });
    }
  }

  return {
    success: filledCount > 0,
    totalFields: mappings.length,
    filledFields: filledCount,
    skippedFields: skippedCount,
    fieldResults,
    timestamp: new Date().toISOString(),
  };
}
