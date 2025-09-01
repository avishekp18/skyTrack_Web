// vite.config.cjs
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  base: "./skyTrack_Web", // ✅ important for Netlify
});
