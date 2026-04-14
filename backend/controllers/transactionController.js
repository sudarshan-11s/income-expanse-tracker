import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
  const tx = await Transaction.create({
    ...req.body,
    user: req.user.id,
  });

  res.json(tx);
};

export const getTransactions = async (req, res) => {
  const data = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
  res.json(data);
};

export const deleteTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);

  if (tx.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  await tx.deleteOne();
  res.json({ message: "Deleted" });
};