import { setupIframe, updateIframeContent } from './iframeSetup';
import { prepareContent } from './contentPreparation';
import { debounce } from './utils';

const IFRAME_CLASS = 'added-by-extension';

/**
 * Initializes iframes for HTML code blocks.
 * @throws {Error} If there's an issue creating or updating iframes.
 */
export function initializeIframes() {
  try {
    const htmlCodeSpaces = document.querySelectorAll(".language-html");
    htmlCodeSpaces.forEach(handleHtmlCodeSpace);
  } catch (error) {
    console.error('Error initializing iframes:', error);
  }
}

const debouncedHandleHtmlCodeSpace = debounce(handleHtmlCodeSpace, 200);

/**
 * Handles a single HTML code space.
 * @param {Element} htmlCodeSpace - The HTML code space element.
 */
function handleHtmlCodeSpace(htmlCodeSpace: Element) {
  const messageContainer = htmlCodeSpace.closest("[data-message-id]");
  if (!messageContainer) return;

  let iframe = messageContainer.querySelector<HTMLIFrameElement>(`iframe.${IFRAME_CLASS}`);
  if (!iframe) {
    iframe = createIframe(messageContainer);
  }
  updateIframeIfNeeded(iframe, messageContainer);
}

/**
 * Creates a new iframe and adds it to the message container.
 * @param {Element} messageContainer - The container to add the iframe to.
 * @returns {HTMLIFrameElement} The created iframe.
 */
function createIframe(messageContainer: Element): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.className = IFRAME_CLASS;
  setupIframe(iframe);
  messageContainer.appendChild(iframe);
  return iframe;
}

/**
 * Updates the iframe content if it has changed.
 * @param {HTMLIFrameElement} iframe - The iframe to update.
 * @param {Element} container - The container with the code content.
 */
function updateIframeIfNeeded(iframe: HTMLIFrameElement, container: Element) {
  const newContent = prepareContent(container);
  if (iframe.getAttribute('data-content') !== newContent) {
    updateIframeContent(iframe, container);
  }
}

/**
 * Clears all iframes added by the extension.
 */
export function clearIframes() {
  document.querySelectorAll(`iframe.${IFRAME_CLASS}`).forEach(iframe => {
    iframe.remove();
  });
}