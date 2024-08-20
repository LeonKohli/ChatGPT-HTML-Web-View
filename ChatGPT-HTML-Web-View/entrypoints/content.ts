export default defineContentScript({
  matches: ['*://*.chat.openai.com/*', '*://*.chatgpt.com/*'],
  main() {
    const updateInterval = 2000;
    let isEnabled = true;

    function clearIframes() {
      document.querySelectorAll("iframe.added-by-extension").forEach(iframe => {
        iframe.parentNode?.removeChild(iframe);
      });
    }

    function initializeIframes() {
      document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
        const messageContainer = htmlCodeSpace.closest("[data-message-id]");
        if (!messageContainer) return;

        let iframe = messageContainer.querySelector<HTMLIFrameElement>("iframe.added-by-extension");
        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.className = "added-by-extension";
          setupIframe(iframe);
          messageContainer.appendChild(iframe);
          updateIframeContent(iframe, messageContainer);
        } else {
          // Only update if content has changed
          const newContent = prepareContent(messageContainer);
          if (iframe.getAttribute('data-content') !== newContent) {
            updateIframeContent(iframe, messageContainer);
          }
        }
      });
    }

    function updateIframeContent(iframe: HTMLIFrameElement, container: Element) {
      const content = prepareContent(container);
      iframe.setAttribute('data-content', content);
      
      const blob = new Blob([content], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      iframe.src = blobUrl;
      
      // Clean up the old Blob URL after the iframe has loaded
      iframe.onload = () => {
        URL.revokeObjectURL(blobUrl);
        addEditOnCodePenButton(iframe, container);
      };
    }

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

    browser.storage.local.get(['isEnabled']).then(result => {
      isEnabled = result.isEnabled !== false;
      if (isEnabled) {
        initializeIframes();
      }
    });

    const observer = new MutationObserver(() => {
      if (isEnabled) {
        initializeIframes();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    function setupIframe(iframe: HTMLIFrameElement) {
      Object.assign(iframe.style, {
        width: "100%", height: "400px", border: "none",
        borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative"
      });
      iframe.setAttribute("sandbox", "allow-scripts allow-forms allow-popups allow-same-origin allow-modals");
    }

    function prepareContent(container: Element) {
      const htmlContent = container.querySelector(".language-html")?.textContent || '';
      const cssContent = Array.from(container.querySelectorAll(".language-css"))
        .map(css => css.textContent)
        .join("");
      const jsContent = Array.from(container.querySelectorAll(".language-javascript"))
        .map(js => js.textContent)
        .join("");

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssContent}</style>
        </head>
        <body>
          ${htmlContent}
          <script type="module">${jsContent}</script>
        </body>
        </html>
      `;
    }

    function addEditOnCodePenButton(iframe: HTMLIFrameElement, container: Element) {
      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) return;

      let codepenButton = iframeDocument.querySelector(".codepen-button");
      if (!codepenButton) {
        const data = {
          html: container.querySelector(".language-html")?.textContent || '',
          css: Array.from(container.querySelectorAll(".language-css"))
            .map(css => css.textContent)
            .join(""),
          js: Array.from(container.querySelectorAll(".language-javascript"))
            .map(js => js.textContent)
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

        iframeDocument.body.insertAdjacentHTML("beforeend", form);
        styleCodePenButton(iframeDocument);
      }
    }

    function styleCodePenButton(doc: Document) {
      const buttonContainer = doc.querySelector(".codepen-button-container");
      if (buttonContainer) {
        Object.assign(buttonContainer.style, {
          position: "fixed", bottom: "10px", right: "10px", zIndex: "1000",
          backdropFilter: "blur(4px)", backgroundColor: "rgba(255, 255, 255, 0.1)"
        });
        const button = buttonContainer.querySelector<HTMLElement>(".codepen-button");
        if (button) {
          Object.assign(button.style, {
            padding: "8px 12px", backgroundColor: "rgba(10, 10, 35, 0.6)",
            color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px",
            cursor: "pointer", transition: "background-color 0.3s ease"
          });
          button.addEventListener("mouseover", () => button.style.backgroundColor = "rgba(26, 26, 58, 0.8)");
          button.addEventListener("mouseout", () => button.style.backgroundColor = "rgba(10, 10, 35, 0.6)");
        }
      }
    }
  },
});