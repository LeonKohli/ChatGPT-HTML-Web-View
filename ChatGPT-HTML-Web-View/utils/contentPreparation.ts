export function prepareContent(container: Element) {
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