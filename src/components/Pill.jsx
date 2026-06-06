export function Pill({ icon, text, tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black ${
        tone === "teal"
          ? "border-teal/25 bg-teal/10 text-teal"
          : "border-line bg-canvas text-muted"
      }`}
    >
      {icon}
      {text}
    </span>
  );
}
