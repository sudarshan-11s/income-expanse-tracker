import { startTransition, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  HandCoins,
  Landmark,
  LogOut,
  Pencil,
  PieChart as PieChartIcon,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthContext } from "../context/auth-context";
import { useDashboard } from "../hooks/useDashboard";
import EmptyTransactionsState from "../components/dashboard/EmptyTransactionsState";
import SectionCard from "../components/dashboard/SectionCard";
import StatCard from "../components/dashboard/StatCard";
import TransactionModal from "../components/dashboard/TransactionModal";

const categoryOptions = [
  "Housing",
  "Food",
  "Salary",
  "Utilities",
  "Freelance",
  "Transport",
  "Healthcare",
  "Investment",
  "Entertainment",
  "Shopping",
  "Travel",
  "Other",
];

const chartPalette = [
  "#0f766e",
  "#0891b2",
  "#2563eb",
  "#4f46e5",
  "#0284c7",
  "#14b8a6",
  "#475569",
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildMonthlyTotals(transactions) {
  const monthlyMap = new Map();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = monthlyMap.get(key) || { income: 0, expense: 0 };

    if (transaction.type === "income") {
      current.income += Number(transaction.amount);
    } else {
      current.expense += Number(transaction.amount);
    }

    monthlyMap.set(key, current);
  }

  return Array.from(monthlyMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, totals]) => ({ month, ...totals }));
}

function buildTrendData(transactions) {
  let runningBalance = 0;

  return [...transactions]
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .map((transaction) => {
      runningBalance +=
        transaction.type === "income"
          ? Number(transaction.amount)
          : -Number(transaction.amount);

      return {
        date: new Date(transaction.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        balance: runningBalance,
      };
    });
}

function buildCategoryBreakdown(transactions) {
  const totals = new Map();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    totals.set(
      transaction.category,
      (totals.get(transaction.category) || 0) + Number(transaction.amount)
    );
  }

  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
}

function buildInsights(transactions) {
  const categoryBreakdown = buildCategoryBreakdown(transactions);
  const monthlyTotals = buildMonthlyTotals(transactions);
  const currentMonth = monthlyTotals.at(-1);
  const previousMonth = monthlyTotals.at(-2);
  const bigSpender = categoryBreakdown[0];
  let budgetHealth = "Add another month of activity to unlock trend-based guidance.";

  if (currentMonth && previousMonth && previousMonth.expense > 0) {
    const change =
      ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) *
      100;
    const rounded = Math.round(Math.abs(change));

    if (change < 0) {
      budgetHealth = `You spent ${rounded}% less than last month. Cash flow is moving in the right direction.`;
    } else if (change > 0) {
      budgetHealth = `Spending is up ${rounded}% versus last month. Housing and lifestyle costs may need a quick review.`;
    } else {
      budgetHealth = "Spending is flat month over month, which is a healthy sign of control.";
    }
  }

  return { bigSpender, budgetHealth };
}

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    transactions,
    filteredTransactions,
    role,
    setRole,
    filters,
    setFilters,
    loading,
    mutating,
    error,
    setError,
    saveTransaction,
    removeTransaction,
  } = useDashboard();
  const [modalState, setModalState] = useState(null);

  const totalBalance = filteredTransactions.reduce((total, transaction) => {
    return (
      total +
      (transaction.type === "income"
        ? Number(transaction.amount)
        : -Number(transaction.amount))
    );
  }, 0);
  const monthlyTotals = buildMonthlyTotals(filteredTransactions);
  const latestMonth = monthlyTotals.at(-1);
  const monthlyIncome = latestMonth?.income || 0;
  const monthlyExpense = latestMonth?.expense || 0;
  const trendData = buildTrendData(filteredTransactions);
  const categoryBreakdown = buildCategoryBreakdown(filteredTransactions);
  const insights = buildInsights(filteredTransactions);

  const handleFilterChange = (field, value) => {
    startTransition(() => {
      setFilters((current) => ({ ...current, [field]: value }));
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#eef4ff_0%,_rgba(245,247,251,0)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="rounded-[32px] border border-slate-200/70 bg-slate-950 px-6 py-6 text-white shadow-xl shadow-slate-900/10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                  Financial Command Center
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  A modern finance dashboard for fast decisions and cleaner cash flow.
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Track balance trends, monitor spending categories, and switch between admin and viewer access without leaving the page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Ledger Size
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{transactions.length}</p>
                  <p className="mt-1 text-sm text-slate-400">Mock transactions loaded</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Active Role
                  </p>
                  <p className="mt-2 text-2xl font-semibold capitalize">{role}</p>
                  <p className="mt-1 text-sm text-slate-400">Controls table permissions</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Visible Rows
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{filteredTransactions.length}</p>
                  <p className="mt-1 text-sm text-slate-400">Filtered transaction count</p>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <SectionCard
                title="Dashboard controls"
                eyebrow="Top Bar"
                actions={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                      <ShieldCheck className="h-4 w-4 text-cyan-600" />
                      <select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        className="bg-transparent text-slate-900 outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </label>
                    {role === "admin" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setModalState({ mode: "create", transaction: null });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        <Plus className="h-4 w-4" />
                        Add Transaction
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                }
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
                  <label className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={filters.search}
                      onChange={(event) => handleFilterChange("search", event.target.value)}
                      placeholder="Search by category or description"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
                    />
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={filters.type}
                      onChange={(event) => handleFilterChange("type", event.target.value)}
                      className="w-full bg-transparent text-slate-900 outline-none"
                    >
                      <option value="all">All types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFilters({ search: "", type: "all" })}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Reset filters
                  </button>
                </div>
                {error ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}
              </SectionCard>

              <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(totalBalance)} tone="neutral" caption="Net of all visible income and expenses" />
                <StatCard icon={ArrowUpRight} label="Monthly Income" value={formatCurrency(monthlyIncome)} tone="success" caption="Income captured in the latest visible month" />
                <StatCard icon={ArrowDownRight} label="Monthly Expenses" value={formatCurrency(monthlyExpense)} tone="danger" caption="Expense run rate for the latest visible month" />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <SectionCard title="Balance trend" eyebrow="Visualization">
                  {trendData.length ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" />
                          <YAxis stroke="#64748b" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Line type="monotone" dataKey="balance" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <EmptyTransactionsState />
                  )}
                </SectionCard>

                <SectionCard title="Spend by category" eyebrow="Visualization">
                  {categoryBreakdown.length ? (
                    <div className="grid items-center gap-4 lg:grid-cols-[1fr_180px]">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} paddingAngle={3}>
                              {categoryBreakdown.map((entry, index) => (
                                <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {categoryBreakdown.slice(0, 5).map((entry, index) => (
                          <div key={entry.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: chartPalette[index % chartPalette.length] }} />
                                <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-slate-950">{formatCurrency(entry.value)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyTransactionsState />
                  )}
                </SectionCard>
              </div>
            </div>

            <div className="space-y-6">
              <SectionCard title="Insights engine" eyebrow="Analysis">
                <div className="space-y-4">
                  <article className="rounded-[24px] bg-slate-950 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <HandCoins className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">The Big Spender</p>
                        <h3 className="text-xl font-semibold">{insights.bigSpender ? insights.bigSpender.name : "No expense data"}</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {insights.bigSpender ? `${insights.bigSpender.name} leads expense volume at ${formatCurrency(insights.bigSpender.value)}.` : "Add or unfilter expense transactions to surface the highest spending category."}
                    </p>
                  </article>
                  <article className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Budget Health</p>
                        <h3 className="text-xl font-semibold text-slate-950">Monthly observation</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{insights.budgetHealth}</p>
                  </article>
                  <article className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                        <PieChartIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Filter snapshot</p>
                        <h3 className="text-xl font-semibold text-slate-950">
                          {filters.type === "all" ? "All transaction types" : `${filters.type} only`}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span>Search term</span>
                        <span className="font-medium text-slate-950">{filters.search || "None"}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span>Visible rows</span>
                        <span className="font-medium text-slate-950">{filteredTransactions.length}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span>Permissions</span>
                        <span className="font-medium capitalize text-slate-950">{role}</span>
                      </div>
                    </div>
                  </article>
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="mt-6">
            <SectionCard title="Transactions" eyebrow="Management">
              {filteredTransactions.length ? (
                <div className="overflow-hidden rounded-[24px] border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left">
                      <thead className="bg-slate-50">
                        <tr className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          <th className="px-4 py-4 font-semibold">Date</th>
                          <th className="px-4 py-4 font-semibold">Description</th>
                          <th className="px-4 py-4 font-semibold">Category</th>
                          <th className="px-4 py-4 font-semibold">Type</th>
                          <th className="px-4 py-4 font-semibold text-right">Amount</th>
                          <th className="px-4 py-4 font-semibold text-right">{role === "admin" ? "Actions" : "Access"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="align-top">
                            <td className="px-4 py-4 text-sm text-slate-500">{formatDate(transaction.date)}</td>
                            <td className="px-4 py-4">
                              <p className="font-medium text-slate-950">{transaction.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{transaction.description || "No extra notes"}</p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{transaction.category}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transaction.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-semibold text-slate-950">{formatCurrency(transaction.amount)}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {role === "admin" ? (
                                  <>
                                    <button type="button" onClick={() => { setError(""); setModalState({ mode: "edit", transaction }); }} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-950" aria-label={`Edit ${transaction.title}`}>
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => removeTransaction(transaction.id)} className="rounded-full border border-rose-200 p-2 text-rose-500 transition hover:border-rose-300 hover:text-rose-700" aria-label={`Delete ${transaction.title}`}>
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-sm text-slate-400">Read only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyTransactionsState />
              )}
            </SectionCard>
          </div>
        </div>
      </div>

      {modalState && role === "admin" ? (
        <TransactionModal
          categoryOptions={categoryOptions}
          initialValues={modalState.transaction}
          mode={modalState.mode}
          saving={mutating}
          onClose={() => setModalState(null)}
          onSubmit={(values) => saveTransaction(values, modalState.transaction?.id)}
        />
      ) : null}
    </>
  );
}
