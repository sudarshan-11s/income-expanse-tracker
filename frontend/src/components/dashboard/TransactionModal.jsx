import { useState } from "react";

function normalizeForm(transaction) {
  if (!transaction) {
    return {
      title: "",
      description: "",
      amount: "",
      category: "Food",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
    };
  }

  return {
    title: transaction.title,
    description: transaction.description || "",
    amount: String(transaction.amount),
    category: transaction.category,
    type: transaction.type,
    date: transaction.date.slice(0, 10),
  };
}

export default function TransactionModal({
  categoryOptions,
  initialValues,
  mode,
  onClose,
  onSubmit,
  saving,
}) {
  const [form, setForm] = useState(normalizeForm(initialValues));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSubmit(form);

    if (result?.ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {mode === "edit" ? "Admin Edit" : "Admin Create"}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {mode === "edit" ? "Edit transaction" : "Add transaction"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Description
            </span>
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Salary credit"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Notes
            </span>
            <textarea
              rows="3"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Optional detail for search and context"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Amount
            </span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.amount}
              onChange={(event) =>
                setForm((current) => ({ ...current, amount: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Date
            </span>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Category
            </span>
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Type
            </span>
            <select
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
