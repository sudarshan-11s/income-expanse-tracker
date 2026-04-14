export default function BalanceCard({ data }) {
  return (
    <div className="bg-gradient-to-r-100 from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg">
      <p className="text-sm text-gray-200">Total Balance</p>

      <h1 className="text-3xl font-bold mt-2 text-white">
        ₹ {data.totalBalance || 0}
      </h1>

      <div className="flex justify-between mt-4 text-sm text-gray-200">
        <span>Income: ₹ {data.income || 0}</span>
        <span>Expense: ₹ {data.expense || 0}</span>
      </div>
    </div>
  );
}