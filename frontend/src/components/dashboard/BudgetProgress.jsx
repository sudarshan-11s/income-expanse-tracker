export default function BudgetProgress({ data }) {
  const expense = data.expense || 0;
  const budget = data.budget || 1;

  const percentage = (expense / budget) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-gray-400 text-sm">Monthly Budget</h3>

      <div className="mt-4">
        <div className="w-full bg-gray-700 h-3 rounded">
          <div
            className="bg-red-500 h-3 rounded"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm mt-2 text-gray-300">
          <span>₹ {expense}</span>
          <span>₹ {budget}</span>
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {percentage.toFixed(1)}% used
        </p>
      </div>
    </div>
  );
}