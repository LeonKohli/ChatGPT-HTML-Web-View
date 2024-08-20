<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const isEnabled = ref(true);

onMounted(async () => {
  const result = await browser.storage.local.get('isEnabled');
  isEnabled.value = result.isEnabled !== false;
});

function togglePreview() {
  browser.storage.local.set({ isEnabled: isEnabled.value });
}
</script>

<template>
  <div class="container">
    <h1>ChatGPT Web Preview</h1>
    <div class="toggle-container">
      <span class="toggle-label">Enable Preview</span>
      <label class="switch">
        <input type="checkbox" v-model="isEnabled" @change="togglePreview">
        <span class="slider round"></span>
      </label>
    </div>
    <footer>
      <a href="https://github.com/leonkohli/ChatGPT-HTML-Web-View" target="_blank" class="github-link">
        <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        View on GitHub
      </a>
    </footer>
  </div>
</template>

<style scoped>
.container {
  width: 300px;
  padding: 24px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
}

.toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-label {
  font-size: 16px;
  color: #555;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: #4CAF50;
}

input:focus+.slider {
  box-shadow: 0 0 1px #4CAF50;
}

input:checked+.slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 28px;
}

.slider.round:before {
  border-radius: 50%;
}

footer {
  margin-top: 24px;
}

.github-link {
  display: inline-flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  background-color: white;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.github-link:hover {
  background-color: #333;
  color: white;
}

.github-icon {
  margin-right: 8px;
}

.github-link:hover .github-icon {
  fill: white;
}
</style>