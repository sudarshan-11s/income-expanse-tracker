import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/auth-context";
import AuthShell from "../components/auth/AuthShell";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      login(response.data.token);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Login"
      title="Welcome back"
      description="Log in to continue tracking transactions, reviewing insights, and switching dashboard roles."
      aside={[
        { label: "Access", value: "Admin", caption: "role toggle ready" },
        { label: "Charts", value: "2", caption: "trend plus breakdown" },
        { label: "Ledger", value: "15", caption: "mock entries seeded" },
      ]}
    >
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          placeholder="Password"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-cyan-700 hover:text-cyan-600" to="/register">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
