/**
 * Background Service Worker for Manifest V3 extension.
 * Manages inter-tab messaging, domain mappings caching, and secure content script injection.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Excel AutoFill Extension installed successfully.');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', version: '1.0.0' });
    return true;
  }

  if (message.type === 'GET_TAB_INFO' && sender.tab) {
    sendResponse({ url: sender.tab.url, id: sender.tab.id });
    return true;
  }
});
