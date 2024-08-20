import { setupIframe } from './iframeSetup';
import { prepareContent } from './contentPreparation';
import { addEditOnCodePenButton } from './codepenButton';

export function clearIframes() {
  document.querySelectorAll("iframe.added-by-extension").forEach(iframe => {
    iframe.parentNode?.removeChild(iframe);
  });
}

export function initializeIframes(isCodePenEnabled: boolean) {
  document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
    const messageContainer = htmlCodeSpace.closest("[data-message-id]");
    if (!messageContainer) return;

    let iframe = messageContainer.querySelector<HTMLIFrameElement>("iframe.added-by-extension");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.className = "added-by-extension";
      setupIframe(iframe);
      messageContainer.appendChild(iframe);
      updateIframeContent(iframe, messageContainer, isCodePenEnabled);
    } else {
      const newContent = prepareContent(messageContainer);
      if (iframe.getAttribute('data-content') !== newContent) {
        updateIframeContent(iframe, messageContainer, isCodePenEnabled);
      }
    }
  });
}

function updateIframeContent(iframe: HTMLIFrameElement, container: Element, isCodePenEnabled: boolean) {
  const content = prepareContent(container);
  iframe.setAttribute('data-content', content);
  
  const blob = new Blob([content], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  
  iframe.src = blobUrl;
  
  iframe.onload = () => {
    URL.revokeObjectURL(blobUrl);
    if (isCodePenEnabled) {
      addEditOnCodePenButton(iframe, container);
    }
  };
}

export function setupStorageListener(callback: (changes: { [key: string]: { oldValue?: any; newValue?: any } }) => void) {
  browser.storage.onChanged.addListener(callback);
}