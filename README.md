🌤 Weather Insight

A React weather app displaying current weather and a 7-day forecast with universe-themed background, autocomplete search, and smooth blur effects.

⚡ Features

<div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;"> <span style="background:linear-gradient(to right,#facc15,#fbbf24); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">🌡 Current Weather</span> <span style="background:linear-gradient(to right,#34d399,#10b981); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">📅 7-Day Forecast</span> <span style="background:linear-gradient(to right,#60a5fa,#3b82f6); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">📍 Geolocation</span> <span style="background:linear-gradient(to right,#f472b6,#ec4899); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">🔍 City Search</span> <span style="background:linear-gradient(to right,#a78bfa,#8b5cf6); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">🌫 Blur Effect</span> <span style="background:linear-gradient(to right,#f87171,#ef4444); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">📱 Responsive Design</span> <span style="background:linear-gradient(to right,#34d399,#10b981); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">🛡 Error Handling</span> <span style="background:linear-gradient(to right,#fbbf24,#f59e0b); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">✨ Animations</span> <span style="background:linear-gradient(to right,#60a5fa,#3b82f6); padding:0.25rem 0.5rem; border-radius:0.5rem; font-weight:600;">♿ Accessibility</span> </div>
🛠 Prerequisites

Node.js: v16+

OpenWeatherMap API Key: Sign up here

🚀 Setup Instructions
1️⃣ Clone the Repository
git clone <repository-url>
cd weather-app

Or create a new Vite React project:

npm create vite@latest weather-app -- --template react
cd weather-app
npm install

2️⃣ Install Dependencies
npm install react react-dom react-chartjs-2 chart.js lodash axios react-select
npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react
npx tailwindcss init -p

3️⃣ Configure Tailwind CSS

tailwind.config.js:

module.exports = {
content: ["./index.html","./src/**/*.{js,jsx}"],
theme: { extend: {} },
plugins: [],
}

src/index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

4️⃣ Set API Key

src/components/Api.js:

export const WEATHER_API_KEY = 'your-api-key-here';

5️⃣ Run Application
npm run dev

Visit http://localhost:5173

🗂 Project Structure
src/
├── components/
│ ├── Inputs.jsx # AsyncSearch input
│ ├── TemperatureAndDetails.jsx # Current weather
│ ├── SunriseAndSunset.jsx # Sunrise & sunset
│ ├── Forecast.jsx # 7-day forecast chart
│ ├── TopButtons.jsx # Geolocation button
│ ├── ErrorBoundary.jsx # Catch errors
│ └── Api.js # API configuration
├── App.jsx # Main layout
└── index.css # Tailwind setup

🔍 Usage
📍 Geolocation

Prompts for location on load.

Shows weather for current location.

Displays instructions if permission is denied.

🔎 City Search

Type a city (e.g., "London").

Autocomplete powered by OpenWeatherMap API.

Background blurs while typing/loading options.

🗓 Tabs

Toggle Current Weather / 7-Day Forecast.

Smooth transitions & responsive layout.

⚠ Error Handling

Handles API errors, invalid city names, or geolocation denial.

ErrorBoundary catches rendering issues.

🎨 Notes

API Key: Ensure it’s valid.

Font: Default font-sans, customizable in index.css.

Performance: 60+ SVG circles in the background may affect low-end devices.

TypeScript: Optional for type safety.

📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
