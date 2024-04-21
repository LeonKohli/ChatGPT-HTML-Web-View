document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('togglePreview');
    checkbox.addEventListener('change', function() {
      chrome.storage.local.set({isEnabled: checkbox.checked});
    });
  
    // Initialize checkbox state from storage
    chrome.storage.local.get('isEnabled', function(data) {
      checkbox.checked = data.isEnabled !== false;
    });
  });