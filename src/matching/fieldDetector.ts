import { DetectedFormField, FormFieldType } from '../types';

/**
 * Traverses a container or entire document to detect all interactive form controls
 * and extracts comprehensive semantic labeling signals.
 */
export function detectFormFields(container: HTMLElement | Document = document): DetectedFormField[] {
  const detected: DetectedFormField[] = [];
  const processedRadioNames = new Set<string>();

  // Select all candidate inputs, selects, and textareas
  const elements = container.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea'
  );

  elements.forEach((el, index) => {
    const tagName = el.tagName.toLowerCase();
    let type: FormFieldType = 'text';

    if (tagName === 'textarea') {
      type = 'textarea';
    } else if (tagName === 'select') {
      type = 'select';
    } else if (tagName === 'input') {
      const inputType = (el.getAttribute('type') || 'text').toLowerCase();
      if (['text', 'email', 'number', 'tel', 'radio', 'checkbox'].includes(inputType)) {
        type = inputType as FormFieldType;
      } else {
        type = 'text';
      }
    }

    const id = el.getAttribute('id') || `form-field-${index}`;
    const name = el.getAttribute('name') || '';

    // Handle radio groups uniquely
    if (type === 'radio') {
      const groupName = name || id;
      if (processedRadioNames.has(groupName)) {
        return; // Already processed as part of the group
      }
      processedRadioNames.add(groupName);

      // Find all radio inputs with this name
      const radioElements = container.querySelectorAll<HTMLInputElement>(
        `input[type="radio"][name="${groupName}"]`
      );

      const radioValues: Array<{ value: string; label: string; elementSelector: string }> = [];
      let groupLabel = '';

      radioElements.forEach((radio, rIdx) => {
        const rVal = radio.value;
        const rLabel = extractElementLabel(radio, container);
        const rSelector = radio.id ? `#${radio.id}` : `input[type="radio"][name="${groupName}"][value="${rVal}"]`;
        radioValues.push({
          value: rVal,
          label: rLabel || rVal,
          elementSelector: rSelector,
        });

        if (!groupLabel && rLabel) {
          // Attempt to find group container heading / legend
          const fieldset = radio.closest('fieldset');
          const legend = fieldset?.querySelector('legend');
          if (legend && legend.textContent) {
            groupLabel = legend.textContent.trim();
          }
        }
      });

      if (!groupLabel) {
        // Look for preceding text or parent label
        groupLabel = findContextualGroupLabel(el) || groupName;
      }

      detected.push({
        id: groupName,
        name: groupName,
        type: 'radio',
        label: groupLabel,
        selector: `input[type="radio"][name="${groupName}"]`,
        radioValues,
        contextText: extractNearbyText(el),
      });

      return;
    }

    // Single input, textarea, or select
    const label = extractElementLabel(el, container) || name || id;
    const placeholder = el.getAttribute('placeholder') || undefined;
    const ariaLabel = el.getAttribute('aria-label') || undefined;
    const selector = buildUniqueSelector(el, index);
    const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

    let options: Array<{ value: string; label: string }> | undefined;

    if (type === 'select' && el instanceof HTMLSelectElement) {
      options = Array.from(el.options).map(opt => ({
        value: opt.value,
        label: opt.text.trim() || opt.value,
      }));
    }

    detected.push({
      id,
      name,
      type,
      label,
      placeholder,
      ariaLabel,
      selector,
      options,
      required,
      currentValue: (el as HTMLInputElement).value || '',
      contextText: extractNearbyText(el),
    });
  });

  return detected;
}

/**
 * Extracts human-readable label from element using standard HTML and ARIA conventions.
 */
export function extractElementLabel(el: HTMLElement, container: HTMLElement | Document = document): string {
  // 1. Check aria-labelledby
  const ariaLabelledBy = el.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelEl = container.querySelector(`#${ariaLabelledBy}`);
    if (labelEl && labelEl.textContent) {
      return labelEl.textContent.trim();
    }
  }

  // 2. Check aria-label
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // 3. Check for associated <label for="id">
  if (el.id) {
    const labelEl = container.querySelector(`label[for="${el.id}"]`);
    if (labelEl && labelEl.textContent) {
      return cleanLabelText(labelEl.textContent);
    }
  }

  // 4. Check wrapping <label>
  const parentLabel = el.closest('label');
  if (parentLabel && parentLabel.textContent) {
    return cleanLabelText(parentLabel.textContent);
  }

  // 5. Check placeholder
  const placeholder = el.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) {
    return placeholder.trim();
  }

  // 6. Check data-label or title
  const dataLabel = el.getAttribute('data-label') || el.getAttribute('title');
  if (dataLabel && dataLabel.trim()) {
    return dataLabel.trim();
  }

  // 7. Check preceding sibling element
  const prevEl = el.previousElementSibling;
  if (prevEl && ['label', 'span', 'p', 'div', 'h4', 'h5', 'h6'].includes(prevEl.tagName.toLowerCase())) {
    const txt = prevEl.textContent?.trim();
    if (txt && txt.length < 50) {
      return cleanLabelText(txt);
    }
  }

  return '';
}

function cleanLabelText(text: string): string {
  return text
    .replace(/\s*\*/g, '') // remove required asterisk
    .replace(/\s*:\s*$/, '') // remove trailing colon
    .replace(/\s+/g, ' ')
    .trim();
}

function findContextualGroupLabel(el: HTMLElement): string {
  const container = el.closest('.form-group, .radio-group, fieldset, div');
  if (container) {
    const heading = container.querySelector('label, legend, p, span, h4, h5');
    if (heading && heading.textContent) {
      return cleanLabelText(heading.textContent);
    }
  }
  return '';
}

function extractNearbyText(el: HTMLElement): string {
  const parent = el.parentElement;
  if (!parent) return '';
  return parent.textContent?.replace(/\s+/g, ' ').trim() || '';
}

function buildUniqueSelector(el: HTMLElement, index: number): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }
  const name = el.getAttribute('name');
  if (name) {
    return `${el.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
  }
  return `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`;
}
