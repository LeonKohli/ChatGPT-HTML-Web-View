import { clearIframes, initializeIframes, setupStorageListener } from '../utils/iframeManager';
import { setupMutationObserver } from '../utils/domObserver';

export default defineContentScript({
  matches: ['*://*.chat.openai.com/*', '*://*.chatgpt.com/*'],
  main() {
    let isEnabled = true;
    let isCodePenEnabled = true;

    browser.storage.local.get(['isEnabled', 'isCodePenEnabled']).then(result => {
      isEnabled = result.isEnabled !== false;
      isCodePenEnabled = result.isCodePenEnabled !== false;
      if (isEnabled) {
        initializeIframes(isCodePenEnabled);
      } else {
        clearIframes();
      }
    });

    setupStorageListener((changes) => {
      if (changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
        if (isEnabled) {
          initializeIframes(isCodePenEnabled);
        } else {
          clearIframes();
        }
      }
      if (changes.isCodePenEnabled) {
        isCodePenEnabled = changes.isCodePenEnabled.newValue;
        if (isEnabled) {
          clearIframes();
          initializeIframes(isCodePenEnabled);
        }
      }
    });

    setupMutationObserver(() => {
      if (isEnabled) {
        initializeIframes(isCodePenEnabled);
      }
    });
  },
});