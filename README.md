# 🎯 Quiz App

An interactive quiz application built with **Vite + React + TypeScript** and styled using **Tailwind CSS**.

---

## 🚀 Features
- ⚡ Fast build with [Vite](https://vitejs.dev/)
- 🎨 Styling powered by [Tailwind CSS](https://tailwindcss.com/)
- 📱 Responsive UI
- 🔄 Easy to customize and extend

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd quiz-app
npm install
🛠️ Development Setup
Run the development server

bash
Copy code
npm run dev
The app will be available at http://localhost:5173.

Build for production

bash
Copy code
npm run build
Preview the production build

bash
Copy code
npm run preview
🎨 Tailwind CSS Setup
Ensure postcss.config.js includes:

js
Copy code
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
Ensure tailwind.config.js includes:

js
Copy code
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
Create src/index.css with Tailwind directives:

css
Copy code
@tailwind base;
@tailwind components;
@tailwind utilities;
Import index.css inside src/main.tsx:

tsx
Copy code
import "./index.css";
🧑‍💻 Tech Stack
React

TypeScript

Vite

Tailwind CSS
