import { CreditCard } from "lucide-react";

export default function EmptyTransactionsState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <div className="rounded-full bg-slate-200 p-4 text-slate-600">
        <CreditCard className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        No transactions found
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try adjusting the search term or type filter. Admins can also add a new
        transaction to bring this view back to life.
      </p>
    </div>
  );
}
