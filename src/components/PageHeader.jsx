export function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div className={`mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
