import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const canSubmit = useMemo(() => Boolean(token && email), [token, email]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.error("Invalid reset link");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, token, newPassword: password });
      toast.success("Password updated. Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/login" className="text-sm font-medium text-zinc-500 hover:text-black">
            ← Back to portals
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-black tracking-tight">Reset password</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Set a new password for <span className="font-medium text-black">{email || "your account"}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-black"
              disabled={loading || !canSubmit}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-black"
              disabled={loading || !canSubmit}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Updating..." : "Update password"}
          </button>

          {!canSubmit && (
            <p className="text-xs text-red-600">
              Invalid or incomplete reset link. Please request a new one.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

