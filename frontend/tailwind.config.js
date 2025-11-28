/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 10"', "system-ui", "sans-serif"]
      }
    }
  }
}
