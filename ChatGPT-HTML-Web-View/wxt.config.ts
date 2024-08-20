import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: "ChatGPT Web Preview",
    description: "Preview HTML, CSS, and JS code from ChatGPT.",
    permissions: ["activeTab", "storage"],
    version: "1.1",
    author: "leonkohli",
    homepage_url: "https://gptview.leonkohli.dev/",
    action: {
      default_title: "ChatGPT Web Preview",
      default_popup: "popup.html",
    },
    icons: {
      16: "assets/logo16.png",
      32: "assets/logo32.png",
      48: "assets/logo48.png",
      128: "assets/logo128.png",
    },
    content_scripts: [
      {
        js: ["content.ts"],
        matches: [
          "*://*.chat.openai.com/*",
          "*://*.chatgpt.com/*"
        ],
      },
    ],
  },
  modules: ['@wxt-dev/module-vue'],
});