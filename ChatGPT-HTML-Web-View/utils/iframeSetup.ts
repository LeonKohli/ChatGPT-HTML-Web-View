import { prepareContent } from './contentPreparation';
import { addEditOnCodePenButton } from './codepenButton';

export function setupIframe(iframe: HTMLIFrameElement) {
  Object.assign(iframe.style, {
    width: "100%", height: "400px", border: "none",
    borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative"
  });
  iframe.setAttribute("sandbox", "allow-scripts allow-forms allow-popups allow-same-origin allow-modals");
}

export function updateIframeContent(iframe: HTMLIFrameElement, container: Element, isCodePenEnabled: boolean) {
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