export function Card({ as: Component = "section", children, className = "", ...props }) {
  return (
    <Component className={`rounded-lg border border-line bg-paper shadow-soft ${className}`} {...props}>
      {children}
    </Component>
  );
}
