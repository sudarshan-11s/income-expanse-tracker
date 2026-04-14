export default function SectionCard({ title, eyebrow, actions, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
        </div>
        {actions}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
