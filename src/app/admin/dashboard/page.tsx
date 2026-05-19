"use client";

import { useEffect, useState, useMemo } from "react";
import AdminGuard from "@/components/AdminGuard";
import { getProducts } from "@/lib/products";
import { supabase } from "@/lib/supabase";

function StatusBadge({ stato }: { stato: string }) {
  const colors: Record<string, string> = {
    "In lavorazione": "bg-yellow-100 text-yellow-800",
    Spedito: "bg-blue-100 text-blue-800",
    Consegnato: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[stato] ?? "bg-gray-100 text-gray-800"}`}
    >
      {stato}
    </span>
  );
}

interface Order {
  id: string;
  numero_ordine: string;
  cliente_nome: string;
  totale: number;
  stato: string;
  created_at: string;
}

type TimePeriod = "mese" | "anno" | "sempre";

const PERIOD_LABELS: Record<TimePeriod, string> = {
  mese: "Questo mese",
  anno: "Quest'anno",
  sempre: "Da sempre",
};

function getStartDate(period: TimePeriod): Date | null {
  const now = new Date();
  switch (period) {
    case "mese":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "anno":
      return new Date(now.getFullYear(), 0, 1);
    case "sempre":
      return null;
  }
}

function DashboardContent() {
  const [productCount, setProductCount] = useState(0);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<TimePeriod>("mese");
  const [statsOpen, setStatsOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);

  useEffect(() => {
    getProducts().then((products) => setProductCount(products.length));
    supabase
      .rpc("get_orders")
      .then(({ data }) => {
        if (!data) return;
        const mapped: Order[] = (data as Array<Record<string, unknown>>).map((row) => {
          const cliente = (row.cliente as Record<string, unknown>) || {};
          return {
            id: row.id as string,
            numero_ordine: (cliente.numero_ordine as string) || (row.id as string),
            cliente_nome:
              (cliente.nome_completo as string) ||
              [cliente.nome, cliente.cognome].filter(Boolean).join(" ") ||
              "—",
            totale: Number(row.totale ?? 0),
            stato: (row.stato as string) || "Nuovo",
            created_at: (row.created_at as string) || (row.data_ordine as string) || new Date().toISOString(),
          };
        });
        setAllOrders(mapped);
      });
  }, []);

  const filteredOrders = useMemo(() => {
    const start = getStartDate(period);
    if (!start) return allOrders;
    return allOrders.filter((o) => new Date(o.created_at) >= start);
  }, [allOrders, period]);

  const orderCount = filteredOrders.length;
  const revenue = filteredOrders.reduce((sum, o) => sum + Number(o.totale), 0);
  const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;
  const recentOrders = filteredOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-retro-dark p-4 pt-16 sm:p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="font-heading text-2xl sm:text-3xl text-text-dark">Dashboard</h1>

        {/* Period filter */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap bg-white rounded-full shadow-sm border border-gray-200 p-1 gap-1">
          {(Object.keys(PERIOD_LABELS) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition text-center ${
                period === p
                  ? "bg-[#00d4ff] text-white"
                  : "text-[#1e293b] hover:text-black"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <section className="mb-10">
        <button
          type="button"
          onClick={() => setStatsOpen((v) => !v)}
          className="md:hidden flex items-center justify-between w-full mb-3 px-4 py-2.5 rounded-xl bg-retro-card border border-retro-border text-text-dark"
          aria-expanded={statsOpen}
        >
          <span className="font-heading text-sm tracking-wider uppercase">
            Statistiche
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 text-neon-blue transition-transform ${statsOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${
            statsOpen ? "block" : "hidden md:grid"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Totale Prodotti</p>
            <p className="text-3xl font-bold text-gray-900">{productCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Ordini</p>
            <p className="text-3xl font-bold text-gray-900">{orderCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Ricavi</p>
            <p className="text-3xl font-bold text-gray-900">
              &euro;{revenue.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-1">Valore Medio Ordine</p>
            <p className="text-3xl font-bold text-gray-900">
              &euro;{avgOrderValue.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <button
        type="button"
        onClick={() => setOrdersOpen((v) => !v)}
        className="md:hidden flex items-center justify-between w-full mb-3 px-4 py-2.5 rounded-xl bg-retro-card border border-retro-border text-text-dark"
        aria-expanded={ordersOpen}
      >
        <span className="font-heading text-sm tracking-wider uppercase">
          Ordini Recenti
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 text-neon-blue transition-transform ${ordersOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`bg-white rounded-2xl shadow-md p-4 sm:p-6 ${ordersOpen ? "block" : "hidden md:block"}`}>
        <h2 className="hidden md:block font-heading text-xl text-gray-900 mb-4">
          Ordini Recenti
          {period !== "sempre" && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({PERIOD_LABELS[period].toLowerCase()})
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-retro-border">
                <th className="pb-3 text-sm font-semibold text-gray-700">Numero</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">Data</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">Totale</th>
                <th className="pb-3 text-sm font-semibold text-gray-700">Stato</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-retro-border-light last:border-b-0"
                >
                  <td className="py-3 text-sm text-gray-900 font-medium">
                    {order.numero_ordine}
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    {order.cliente_nome}
                  </td>
                  <td className="py-3 text-sm text-gray-700">
                    {new Date(order.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="py-3 text-sm text-gray-900">
                    &euro;{Number(order.totale).toFixed(2)}
                  </td>
                  <td className="py-3">
                    <StatusBadge stato={order.stato} />
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-600 text-sm">
                    Nessun ordine in questo periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
