// StatCard — Editorial open metric display without boxes or card containers.
export default function StatCard({ label, value, color = 'default', onClick }) {
  const accentDot = {
    green:   'bg-emerald-600',
    red:     'bg-rose-600',
    amber:   'bg-amber-500',
    blue:    'bg-[#C5A059]',
    default: 'bg-[#6B1D2F]',
  };

  const displayVal = typeof value === 'object' && value !== null
    ? (value.message || JSON.stringify(value))
    : String(value ?? '');

  return (
    <div
      className={`py-2 px-1 flex flex-col justify-between transition-opacity ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${accentDot[color] || accentDot.default}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B1D2F]/70">{label}</span>
      </div>
      <span className="text-3xl font-serif font-bold text-[#3B0D18] tracking-tight leading-none">
        {displayVal}
      </span>
    </div>
  );
}
