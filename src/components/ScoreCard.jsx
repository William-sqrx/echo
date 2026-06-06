import { Card } from "./Card";
import { MetricBar } from "./MetricBar";

export function ScoreCard({ title, value, delta, description, className = "" }) {
  return (
    <Card as="article" className={`p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black leading-tight">{title}</h3>
          {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        <p className="text-2xl font-black">{value}</p>
      </div>
      <div className="mt-4">
        <MetricBar label="Score" value={value} delta={delta} percent={value} />
      </div>
    </Card>
  );
}
