import { AutofillHistoryItem, SavedDomainMapping } from '../types';

const STORAGE_KEYS = {
  DOMAIN_MAPPINGS: 'excel_autofill_domain_mappings_v1',
  HISTORY: 'excel_autofill_history_v1',
  SAVED_SESSION: 'excel_autofill_session_v1',
};

export function saveDomainMapping(domain: string, mappings: Record<string, string>): void {
  if (typeof window === 'undefined' || !domain) return;
  try {
    const existing = getAllDomainMappings();
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    existing[cleanDomain] = {
      domain: cleanDomain,
      lastUpdated: new Date().toISOString(),
      mappings,
    };

    localStorage.setItem(STORAGE_KEYS.DOMAIN_MAPPINGS, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save domain mapping to localStorage', err);
  }
}

export function getDomainMapping(domain: string): Record<string, string> | null {
  if (typeof window === 'undefined' || !domain) return null;
  try {
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const existing = getAllDomainMappings();
    return existing[cleanDomain]?.mappings || null;
  } catch {
    return null;
  }
}

export function getAllDomainMappings(): Record<string, SavedDomainMapping> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOMAIN_MAPPINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function deleteDomainMapping(domain: string): void {
  if (typeof window === 'undefined' || !domain) return;
  try {
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const existing = getAllDomainMappings();
    delete existing[cleanDomain];
    localStorage.setItem(STORAGE_KEYS.DOMAIN_MAPPINGS, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to delete domain mapping', err);
  }
}

export function recordAutofillHistory(item: Omit<AutofillHistoryItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getAutofillHistory();
    const newItem: AutofillHistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    // Keep the most recent 100 entries
    const updated = [newItem, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

export function getAutofillHistory(): AutofillHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearAutofillHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

export function clearAllAppData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.DOMAIN_MAPPINGS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SAVED_SESSION);
    sessionStorage.clear();
  } catch (err) {
    console.error('Failed to clear app data', err);
  }
}
