setInterval(() => {
  document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
    const messageContainer = htmlCodeSpace.closest("[data-message-id]");
    if (!messageContainer) return; // Skip if no message container is found

    const messageId = messageContainer.getAttribute("data-message-id");
    const existingIframe = htmlCodeSpace.querySelector("iframe");

    if (
      !htmlCodeSpace.lastChild.tagName ||
      (htmlCodeSpace.lastChild.tagName &&
        htmlCodeSpace.lastChild.tagName.toLowerCase() !== "iframe")
    ) {
      if (existingIframe) {
        existingIframe.remove();
      }
    }

    if (!existingIframe) {
      const htmlContent = htmlCodeSpace.innerText;
      const iframe = document.createElement("iframe");

      htmlCodeSpace.parentElement.style.padding = "0";
      iframe.style.width = "100%";
      iframe.style.height = "60vh";
      iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");

      // Find all CSS code blocks within the same message container and concatenate their content
      const cssContent = Array.from(
        messageContainer.querySelectorAll(".language-css")
      )
        .map((cssCodeSpace) => `<style>${cssCodeSpace.innerText}</style>`)
        .join("");

      // Combine HTML and CSS content
      iframe.srcdoc = cssContent + htmlContent;

      htmlCodeSpace.appendChild(iframe);
    }
  });
}, 2000);