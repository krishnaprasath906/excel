/**
 * Excel AutoFill Extension Content Script.
 * Runs in the context of the target web page.
 * Scans DOM for form fields and executes autofill on user confirmation.
 * Strict Rule: NEVER submit the form automatically.
 */

// Simple listener for messages from popup or web dashboard
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'EXCEL_AUTOFILL_FILL_PAYLOAD') {
    handleAutofillPayload(event.data.payload);
  }
});

// Chrome Extension message listener
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.action === 'SCAN_FORM_FIELDS') {
      const fields = scanPageFormFields();
      sendResponse({ success: true, fields, url: window.location.href });
      return true;
    }

    if (request.action === 'EXECUTE_AUTOFILL') {
      const result = fillPageFormFields(request.mappings);
      sendResponse({ success: true, result });
      return true;
    }
  });
}

function scanPageFormFields() {
  const elements = document.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea'
  );

  const scanned: any[] = [];

  elements.forEach((el, idx) => {
    const tagName = el.tagName.toLowerCase();
    const type = (el.getAttribute('type') || tagName).toLowerCase();
    const id = el.id || `field_${idx}`;
    const name = el.getAttribute('name') || '';
    
    // Extract label
    let label = '';
    if (el.id) {
      const lbl = document.querySelector(`label[for="${el.id}"]`);
      if (lbl) label = lbl.textContent?.trim() || '';
    }
    if (!label) {
      const parentLbl = el.closest('label');
      if (parentLbl) label = parentLbl.textContent?.trim() || '';
    }
    if (!label) {
      label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || name || id;
    }

    let options: string[] = [];
    if (tagName === 'select' && el instanceof HTMLSelectElement) {
      options = Array.from(el.options).map(o => o.text.trim());
    }

    scanned.push({
      id,
      name,
      type,
      label,
      selector: el.id ? `#${el.id}` : (name ? `${tagName}[name="${name}"]` : `${tagName}:nth-of-type(${idx + 1})`),
      options,
    });
  });

  return scanned;
}

function fillPageFormFields(mappings: any[]) {
  let filled = 0;

  mappings.forEach(m => {
    if (!m.formFieldSelector && !m.formFieldId) return;

    let el: HTMLElement | null = null;
    if (m.formFieldSelector) {
      el = document.querySelector(m.formFieldSelector);
    }
    if (!el && m.formFieldId) {
      el = document.getElementById(m.formFieldId);
    }

    if (!el) return;

    const val = String(m.excelValue || '');
    if (!val) return;

    const tagName = el.tagName.toLowerCase();

    if (tagName === 'select' && el instanceof HTMLSelectElement) {
      for (const opt of Array.from(el.options)) {
        if (
          opt.value.toLowerCase() === val.toLowerCase() ||
          opt.text.toLowerCase().includes(val.toLowerCase()) ||
          val.toLowerCase().includes(opt.text.toLowerCase())
        ) {
          el.value = opt.value;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('input', { bubbles: true }));
          highlight(el);
          filled++;
          break;
        }
      }
    } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      // React descriptor setter support
      const proto = Object.getPrototypeOf(el);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) {
        desc.set.call(el, val);
      } else {
        el.value = val;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      highlight(el);
      filled++;
    }
  });

  // Display unobtrusive toast reminder on target page
  showReviewReminderBanner(filled);

  return { filled, total: mappings.length };
}

function highlight(el: HTMLElement) {
  const originalOutline = el.style.outline;
  const originalBg = el.style.backgroundColor;
  el.style.outline = '3px solid #6366f1';
  el.style.backgroundColor = '#eef2ff';
  setTimeout(() => {
    el.style.outline = originalOutline;
    el.style.backgroundColor = originalBg;
  }, 3000);
}

function showReviewReminderBanner(filledCount: number) {
  const banner = document.createElement('div');
  banner.id = 'excel-autofill-banner';
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999999;
    background: #ffffff;
    color: #1e1b4b;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
    border: 2px solid #4f46e5;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 380px;
    animation: slideIn 0.4s ease-out;
  `;
  banner.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <div style="background: #e0e7ff; color: #4338ca; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">✓</div>
      <div>
        <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #1e1b4b;">Excel AutoFill Completed</h4>
        <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 13px; line-height: 1.4;">
          <strong>${filledCount} fields</strong> were successfully populated with record details.
        </p>
        <div style="background: #fef3c7; color: #92400e; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
          ⚠ Please review all values and manually submit this form.
        </div>
      </div>
      <button id="close-autofill-banner" style="background: transparent; border: none; font-size: 18px; color: #9ca3af; cursor: pointer; padding: 0 4px;">&times;</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('close-autofill-banner')?.addEventListener('click', () => {
    banner.remove();
  });

  setTimeout(() => {
    if (banner.parentElement) {
      banner.remove();
    }
  }, 10000);
}

function handleAutofillPayload(payload: any) {
  if (payload && Array.isArray(payload.mappings)) {
    fillPageFormFields(payload.mappings);
  }
}
