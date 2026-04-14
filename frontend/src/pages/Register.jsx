import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthShell from "../components/auth/AuthShell";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Signup"
      title="Create your account"
      description="Sign up to access the full dashboard experience with seeded transaction history and admin controls."
      aside={[
        { label: "Views", value: "2", caption: "admin plus viewer" },
        { label: "Insights", value: "Live", caption: "calculated on load" },
        { label: "Filters", value: "Global", caption: "search plus type" },
      ]}
    >
      <form onSubmit={submit} className="space-y-4">
        <input
          required
          value={form.name}
          placeholder="Full name"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          onChange={(event) => updateField("name", event.target.value)}
        />
        <input
          type="email"
          required
          value={form.email}
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          onChange={(event) => updateField("email", event.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          placeholder="Password"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          onChange={(event) => updateField("password", event.target.value)}
        />

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-medium text-emerald-700 hover:text-emerald-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
