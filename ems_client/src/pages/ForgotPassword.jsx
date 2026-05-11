import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const ForgotPassword = () => {
  const [params] = useSearchParams();
  const role = params.get("role") || "employee";

  const backTo = useMemo(() => {
    const safeRole = role === "admin" ? "admin" : "employee";
    return `/login/${safeRole}`;
  }, [role]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("If the email exists, a reset link has been sent.");
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to={backTo} className="text-sm font-medium text-zinc-500 hover:text-black">
            ← Back to login
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-black tracking-tight">Forgot password</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Enter your email and we’ll send a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm placeholder:text-zinc-400 text-black hover:bg-zinc-50"
              disabled={loading || sent}
            />
          </div>

          <button
            type="submit"
            disabled={loading || sent}
            className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Sending..." : sent ? "Email sent" : "Send reset link"}
          </button>

          {sent && (
            <p className="text-xs text-zinc-500">
              Check your inbox. If you don’t see it, check spam/junk.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

