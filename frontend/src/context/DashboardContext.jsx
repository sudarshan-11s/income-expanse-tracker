import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "./auth-context";
import { DashboardContext } from "./dashboard-context";

const emptyFilters = {
  search: "",
  type: "all",
};

function normalizeTransaction(transaction) {
  return {
    ...transaction,
    id: transaction.id || transaction._id,
    description: transaction.description || "",
  };
}

export function DashboardProvider({ children }) {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState("admin");
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState("");

  const authorizedRequest = useCallback(async (config) => {
    try {
      return await API({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        logout();
        navigate("/login", { replace: true });
      }

      throw requestError;
    }
  }, [logout, navigate, token]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authorizedRequest({
        method: "get",
        url: "/transactions",
      });

      setTransactions(response.data.map(normalizeTransaction));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load transactions right now."
      );
    } finally {
      setLoading(false);
    }
  }, [authorizedRequest]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const saveTransaction = async (payload, editingId) => {
    setMutating(true);
    setError("");

    try {
      const response = await authorizedRequest({
        method: editingId ? "put" : "post",
        url: editingId ? `/transactions/${editingId}` : "/transactions",
        data: {
          title: payload.title.trim(),
          description: payload.description.trim(),
          amount: Number(payload.amount),
          category: payload.category,
          type: payload.type,
          date: payload.date,
        },
      });

      const nextTransaction = normalizeTransaction(response.data);

      setTransactions((current) => {
        if (!editingId) {
          return [nextTransaction, ...current];
        }

        return current.map((transaction) =>
          transaction.id === editingId ? nextTransaction : transaction
        );
      });

      return { ok: true };
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to save transaction right now.";
      setError(message);
      return { ok: false, message };
    } finally {
      setMutating(false);
    }
  };

  const removeTransaction = async (transactionId) => {
    setMutating(true);
    setError("");

    try {
      await authorizedRequest({
        method: "delete",
        url: `/transactions/${transactionId}`,
      });

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== transactionId)
      );

      return { ok: true };
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to delete transaction right now.";
      setError(message);
      return { ok: false, message };
    } finally {
      setMutating(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const searchValue = filters.search.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      transaction.category.toLowerCase().includes(searchValue) ||
      transaction.title.toLowerCase().includes(searchValue) ||
      transaction.description.toLowerCase().includes(searchValue);

    const matchesType =
      filters.type === "all" ? true : transaction.type === filters.type;

    return matchesSearch && matchesType;
  });

  const value = {
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
    reloadTransactions: loadTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
