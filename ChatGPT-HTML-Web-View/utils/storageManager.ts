export function setupStorageListener(callback: (isEnabled: boolean) => void) {
  browser.storage.onChanged.addListener(changes => {
    if (changes.isEnabled) {
      callback(changes.isEnabled.newValue);
    }
  });
}

export async function getInitialEnabledState(): Promise<boolean> {
  const result = await browser.storage.local.get('isEnabled');
  return result.isEnabled !== false;
}