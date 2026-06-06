export function Button({
  as: Component = "button",
  children,
  className = "",
  icon,
  trailingIcon,
  type = "button",
  ...props
}) {
  const componentProps = Component === "button" ? { type, ...props } : props;

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-sm font-black ${className}`}
      {...componentProps}
    >
      {icon}
      {children}
      {trailingIcon}
    </Component>
  );
}

export function IconButton({ children, label, small = false, className = "", ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      className={`grid place-items-center rounded-lg border border-line bg-paper text-muted shadow-soft hover:border-teal hover:text-teal ${
        small ? "h-8 w-8" : "h-10 w-10"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
