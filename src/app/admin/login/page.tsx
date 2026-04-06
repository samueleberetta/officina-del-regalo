"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const success = await login(email, password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Credenziali non valide");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="font-heading text-3xl text-text-dark text-center mb-8">
          Accesso Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-dark mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-beige-dark rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-dark mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-beige-dark rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
