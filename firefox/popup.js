document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('togglePreview');
    checkbox.addEventListener('change', function() {
      browser.storage.local.set({isEnabled: checkbox.checked});
    });
  
    // Initialize checkbox state from storage
    browser.storage.local.get('isEnabled', function(data) {
      checkbox.checked = data.isEnabled !== false;
    });
  });