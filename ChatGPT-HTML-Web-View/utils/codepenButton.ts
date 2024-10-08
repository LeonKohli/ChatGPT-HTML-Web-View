export function addEditOnCodePenButton(iframe: HTMLIFrameElement, container: Element) {
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