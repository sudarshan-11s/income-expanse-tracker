import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    category: {
      type: String,
      enum: [
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
      ],
      default: "Other",
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);
