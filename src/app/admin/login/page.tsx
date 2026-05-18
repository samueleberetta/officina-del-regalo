"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-retro-dark flex items-center justify-center px-4">
      <div className="bg-retro-card rounded-xl border border-retro-border p-8 w-full max-w-md neon-box">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl tracking-wider">
            <span className="text-neon-blue">RETRO</span>
            <span className="text-neon-purple">STATION</span>
          </h1>
          <p className="text-text-medium text-sm mt-2">Accesso Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-retro-darker border border-retro-border rounded-lg px-4 py-2 text-text-dark focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-retro-darker border border-retro-border rounded-lg px-4 py-2 text-text-dark focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-heading tracking-wider py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "ACCESSO..." : "ACCEDI"}
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 border border-retro-border text-text-medium hover:text-text-dark hover:border-neon-blue font-heading tracking-wider py-3 rounded-lg transition"
          >
            <span aria-hidden>←</span> TORNA ALLA HOME
          </Link>
        </form>
      </div>
    </div>
  );
}
