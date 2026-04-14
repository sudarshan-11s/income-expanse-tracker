export default function StatCard({ icon, label, value, tone, caption }) {
  const Icon = icon;

  const tones = {
    neutral:
      "bg-white/85 text-slate-900 ring-1 ring-slate-200 shadow-sm shadow-slate-200/60",
    success:
      "bg-teal-950 text-teal-50 ring-1 ring-teal-900 shadow-lg shadow-teal-900/20",
    danger:
      "bg-slate-900 text-slate-50 ring-1 ring-slate-800 shadow-lg shadow-slate-900/20",
  };

  return (
    <article className={`rounded-3xl p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-70">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-3 text-sm opacity-70">{caption}</p>
        </div>
        <div className="rounded-2xl bg-black/10 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
