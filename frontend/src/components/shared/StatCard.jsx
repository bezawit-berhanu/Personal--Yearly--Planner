// StatCard — translucent metric display card with high contrast text legibility.
export default function StatCard({ label, value, color = 'default', onClick }) {
  const colorMap = {
    green:   'bg-emerald-50/90 text-emerald-900 border-emerald-300',
    red:     'bg-rose-50/90 text-rose-900 border-rose-300',
    amber:   'bg-amber-50/90 text-amber-950 border-amber-300',
    blue:    'bg-sky-50/90 text-sky-900 border-sky-300',
    default: 'bg-white/85 text-slate-900 border-pink-200/80',
  };

  return (
    <div
      className={`flex flex-col gap-0.5 px-4 py-3 rounded-sm border backdrop-blur-md text-sm font-semibold shadow-xs ${colorMap[color] ?? colorMap.default} ${onClick ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
      onClick={onClick}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</span>
      <span className="text-xl font-bold font-serif">{value}</span>
    </div>
  );
}
