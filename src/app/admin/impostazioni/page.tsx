"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import toast from "react-hot-toast";

function ImpostazioniContent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Le due nuove password non corrispondono");
      return;
    }
    if (newPassword.length < 8) {
      setError("La nuova password deve avere almeno 8 caratteri");
      return;
    }
    if (newPassword === currentPassword) {
      setError("La nuova password deve essere diversa da quella attuale");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("odr-admin-token");
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Errore cambio password");
      }
      toast.success("Password aggiornata!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-retro-dark p-4 pt-16 sm:p-6 md:p-10">
      <h1 className="font-heading text-2xl sm:text-3xl text-text-dark mb-8">
        Impostazioni
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 max-w-xl">
        <h2 className="font-heading text-xl text-gray-900 mb-4">
          Cambio password
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          La password e&apos; salvata cifrata (bcrypt). Minimo 8 caratteri.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Password attuale
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nuova password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Conferma nuova password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#00d4ff] text-white px-6 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Salvataggio..." : "Aggiorna password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ImpostazioniPage() {
  return (
    <AdminGuard>
      <ImpostazioniContent />
    </AdminGuard>
  );
}
