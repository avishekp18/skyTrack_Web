const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  base: "/skyTrack_Web/", // ✅ must start and end with "/"
});
