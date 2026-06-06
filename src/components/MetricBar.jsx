export function MetricBar({
  label,
  value,
  delta,
  percent = value,
  barClassName = "bg-current text-teal",
  showValue = true
}) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-2">
        <p className="text-sm font-medium text-muted">{label}</p>
        {showValue ? (
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black">{value}</p>
            {delta ? (
              <span className="rounded-md border border-moss/30 bg-moss/10 px-2 py-0.5 text-xs font-black text-moss">
                {delta}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#eee6da]">
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
