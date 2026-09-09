// StatCard — small metric display card used in summaries above tables and on dashboards.
export default function StatCard({ label, value, color = 'default', icon: Icon, onClick }) {
  const colorMap = {
    green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:     'bg-rose-50 text-rose-700 border-rose-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-cream-100 text-cream-700 border-cream-200',
  };

  return (
    <div
      className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-sm font-medium ${colorMap[color] ?? colorMap.default} ${onClick ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
      onClick={onClick}
    >
      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
      <span className="text-xl font-bold font-serif">{value}</span>
    </div>
  );
}
