(function() {
  const updateInterval = 2000;
  let isEnabled = true;

  // Function to clear all iframes
  function clearIframes() {
    document.querySelectorAll("iframe.added-by-extension").forEach(iframe => {
      iframe.parentNode.removeChild(iframe);
    });
  }

  // Function to initialize or update iframes
  function initializeIframes() {
    document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
      const messageContainer = htmlCodeSpace.closest("[data-message-id]");
      if (!messageContainer) return;

      let iframe = messageContainer.querySelector("iframe.added-by-extension");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.className = "added-by-extension"; // Mark the iframe so we can identify it later
        setupIframe(iframe);
        messageContainer.appendChild(iframe);
      }

      const newContent = prepareContent(messageContainer);
      if (iframe.srcdoc !== newContent) {
        iframe.srcdoc = newContent;
      }

      addEditOnCodePenButton(iframe, messageContainer);
    });
  }

  // Listen for changes in the isEnabled state
  browser.storage.onChanged.addListener(changes => {
    if (changes.isEnabled) {
      isEnabled = changes.isEnabled.newValue;
      if (isEnabled) {
        initializeIframes();
      } else {
        clearIframes();
      }
    }
  });

  // Initial check and setup
  browser.storage.local.get(['isEnabled'], function(result) {
    isEnabled = result.isEnabled !== false; // Default to true if not set
    if (isEnabled) {
      initializeIframes();
    }
  });

  // Regular interval to check and update iframes if enabled
  setInterval(() => {
    if (!isEnabled) return;
    initializeIframes();
  }, updateInterval);

  function setupIframe(iframe) {
    Object.assign(iframe.style, {
      width: "100%", height: "400px", border: "none",
      borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      position: "relative"
    });
    iframe.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation");
  }

  function prepareContent(container) {
    const htmlContent = container.querySelector(".language-html")?.innerText || '';
    const cssContent = Array.from(container.querySelectorAll(".language-css"))
      .map(css => `<style>${css.innerText}</style>`)
      .join("");
    const jsContent = Array.from(container.querySelectorAll(".language-javascript"))
      .map(js => `<script>${js.innerText}</script>`)
      .join("");

    return cssContent + htmlContent + jsContent;
  }

  function addEditOnCodePenButton(iframe, container) {
    let codepenButton = iframe.contentDocument.querySelector(".codepen-button");
    if (!codepenButton && iframe.contentDocument.body) {
      const data = {
        html: container.querySelector(".language-html")?.innerText || '',
        css: Array.from(container.querySelectorAll(".language-css"))
          .map(css => css.innerText)
          .join(""),
        js: Array.from(container.querySelectorAll(".language-javascript"))
          .map(js => js.innerText)
          .join("")
      };

      const JSONstring = JSON.stringify(data)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      const form = `
        <div class="codepen-button-container">
          <form action="https://codepen.io/pen/define" method="POST" target="_blank">
            <input type="hidden" name="data" value='${JSONstring}'>
            <input type="submit" value="Edit on CodePen" class="codepen-button">
          </form>
        </div>
      `;

      iframe.contentDocument.body.insertAdjacentHTML("beforeend", form);
      styleCodePenButton(iframe.contentDocument);
    }
  }

  function styleCodePenButton(doc) {
    const buttonContainer = doc.querySelector(".codepen-button-container");
    Object.assign(buttonContainer.style, {
      position: "fixed", bottom: "10px", right: "10px", zIndex: "1000",
      backdropFilter: "blur(4px)", backgroundColor:       "rgba(255, 255, 255, 0.1)"
    });
    const button = buttonContainer.querySelector(".codepen-button");
    Object.assign(button.style, {
      padding: "8px 12px", backgroundColor: "rgba(10, 10, 35, 0.6)",
      color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px",
      cursor: "pointer", transition: "background-color 0.3s ease"
    });
    button.addEventListener("mouseover", () => button.style.backgroundColor = "rgba(26, 26, 58, 0.8)");
    button.addEventListener("mouseout", () => button.style.backgroundColor = "rgba(10, 10, 35, 0.6)");
  }

})();