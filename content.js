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
      iframe.style.position = "relative";
      iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
      );
      messageContainer.appendChild(iframe);
    }

    const htmlContent = htmlCodeSpace.innerText;
    const cssContent = Array.from(
      messageContainer.querySelectorAll(".language-css")
    )
      .map((cssCodeSpace) => `<style>${cssCodeSpace.innerText}</style>`)
      .join("");
    const jsContent = Array.from(
      messageContainer.querySelectorAll(".language-javascript")
    )
      .map((jsCodeSpace) => `<script>${jsCodeSpace.innerText}</script>`)
      .join("");

    const newContent = cssContent + htmlContent + jsContent;

    if (iframe.srcdoc !== newContent) {
      iframe.srcdoc = newContent;
    }

    // Create "Edit on CodePen" button
    let codepenButton = iframe.contentDocument.querySelector(".codepen-button");
    if (!codepenButton) {
      const data = {
        html: htmlContent,
        css: Array.from(messageContainer.querySelectorAll(".language-css"))
          .map((cssCodeSpace) => cssCodeSpace.innerText)
          .join(""),
        js: Array.from(
          messageContainer.querySelectorAll(".language-javascript")
        )
          .map((jsCodeSpace) => jsCodeSpace.innerText)
          .join(""),
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

      // Style the button container
      const buttonContainer = iframe.contentDocument.querySelector(
        ".codepen-button-container"
      );
      buttonContainer.style.position = "fixed";
      buttonContainer.style.bottom = "10px";
      buttonContainer.style.right = "10px";
      buttonContainer.style.zIndex = "1000";

      // Style the button
      const button = buttonContainer.querySelector(".codepen-button");
      button.style.padding = "8px 12px";
      button.style.backgroundColor = "#0a0a23";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.cursor = "pointer";
      button.style.transition = "background-color 0.3s ease";

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#1a1a3a";
      });

      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#0a0a23";
      });
    }
  });
}, 2000);
