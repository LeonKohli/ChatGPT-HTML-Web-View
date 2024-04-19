setInterval(() => {
  document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
    const messageContainer = htmlCodeSpace.closest("[data-message-id]");
    if (!messageContainer) return;

    let iframe = htmlCodeSpace.querySelector("iframe");

    if (!iframe) {
      iframe = document.createElement("iframe");
      htmlCodeSpace.parentElement.style.padding = "0";
      iframe.style.width = "100%";
      iframe.style.height = "60vh";
      iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
      htmlCodeSpace.appendChild(iframe);
    }

    const htmlContent = htmlCodeSpace.innerText;
    const cssContent = Array.from(
      messageContainer.querySelectorAll(".language-css")
    )
      .map((cssCodeSpace) => `<style>${cssCodeSpace.innerText}</style>`)
      .join("");

    const newContent = cssContent + htmlContent;

    if (iframe.srcdoc !== newContent) {
      iframe.srcdoc = newContent;
    }
  });
}, 2000);