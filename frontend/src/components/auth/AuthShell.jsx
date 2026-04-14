export default function AuthShell({ badge, title, description, aside, children }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.15),_transparent_32%),linear-gradient(180deg,_#eef4ff_0%,_rgba(245,247,251,0)_100%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/10 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
            {badge}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Finance clarity with a cleaner daily workflow.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Sign in to explore a responsive ledger, admin and viewer modes,
            real-time filters, and visual insights built for modern finance teams.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {aside.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.caption}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-sm shadow-slate-200/70 backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {badge}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
