setInterval(() => {
  document.querySelectorAll(".language-html").forEach((htmlCodeSpace) => {
    const messageContainer = htmlCodeSpace.closest("[data-message-id]");
    if (!messageContainer) return;

    let iframe = messageContainer.querySelector("iframe");

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "400px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "5px";
      iframe.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
      messageContainer.appendChild(iframe);
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

    // Create "Edit on CodePen" button
    let codepenButton = messageContainer.querySelector(".codepen-button");
    if (!codepenButton) {
      const data = {
        html: htmlContent,
        css: Array.from(messageContainer.querySelectorAll(".language-css"))
          .map((cssCodeSpace) => cssCodeSpace.innerText)
          .join(""),
      };

      const JSONstring = JSON.stringify(data)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      const form = `
        <form action="https://codepen.io/pen/define" method="POST" target="_blank" class="codepen-button">
          <input type="hidden" name="data" value='${JSONstring}'>
          <input type="submit" value="Edit on CodePen">
        </form>
      `;

      messageContainer.insertAdjacentHTML("beforeend", form);
    }
  });
}, 2000);