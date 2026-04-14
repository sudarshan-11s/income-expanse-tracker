import Transaction from "../models/Transaction.js";


export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ user: userId });

    
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);


    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

  
    const balance = totalIncome - totalExpense;

    
    const categoryData = {};

    transactions.forEach((t) => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = 0;
      }
      categoryData[t.category] += t.amount;
    });

    //  Monthly Data
    const monthlyData = {};

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categoryData,
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};