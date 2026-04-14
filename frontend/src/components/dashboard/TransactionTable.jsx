export default function TransactionTable({ transactions = [] }) {
  return (
    <div className="bg-gray-800 p-5 rounded-xl overflow-x-auto">
      <h3 className="mb-4">Recent Transactions</h3>

      <table className="w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th className="text-left">Title</th>
            <th>Category</th>
            <th>Date</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-t border-gray-700">
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td>{new Date(t.date).toLocaleDateString()}</td>

              <td
                className={`text-right font-semibold ${
                  t.type === "expense"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {t.type === "expense" ? "-" : "+"} ₹{t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}