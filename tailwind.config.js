/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f6f4ef",
        paper: "#fffefa",
        ink: "#22201c",
        muted: "#6f6860",
        line: "#e6ded2",
        teal: "#126d68",
        "teal-dark": "#0d4f4c",
        rust: "#b6533c",
        amber: "#c57b18",
        moss: "#2e7d56"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(34, 32, 28, 0.08)",
        lift: "0 14px 32px rgba(34, 32, 28, 0.12)"
      }
    }
  },
  plugins: []
};
