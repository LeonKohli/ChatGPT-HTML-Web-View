export function setupMutationObserver(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}