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

type TimePeriod = "oggi" | "settimana" | "mese" | "anno" | "sempre";

const PERIOD_LABELS: Record<TimePeriod, string> = {
  oggi: "Oggi",
  settimana: "Questa settimana",
  mese: "Questo mese",
  anno: "Quest'anno",
  sempre: "Sempre",
};

function getStartDate(period: TimePeriod): Date | null {
  const now = new Date();
  switch (period) {
    case "oggi": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "settimana": {
      const d = new Date(now);
      const day = d.getDay() === 0 ? 7 : d.getDay();
      d.setDate(d.getDate() - day + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
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

  useEffect(() => {
    getProducts().then((products) => setProductCount(products.length));
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setAllOrders(data);
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
    <div className="min-h-screen bg-beige-light p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="font-heading text-3xl text-text-dark">Dashboard</h1>

        {/* Period filter */}
        <div className="flex bg-white rounded-full shadow-sm border border-gray-200 p-1">
          {(Object.keys(PERIOD_LABELS) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                period === p
                  ? "bg-[#B8976A] text-white"
                  : "text-[#6B6B6B] hover:text-[#2C2C2C]"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Totale Prodotti</p>
          <p className="text-3xl font-bold text-text-dark">{productCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Ordini</p>
          <p className="text-3xl font-bold text-text-dark">{orderCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Ricavi</p>
          <p className="text-3xl font-bold text-text-dark">
            &euro;{revenue.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Valore Medio Ordine</p>
          <p className="text-3xl font-bold text-text-dark">
            &euro;{avgOrderValue.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-heading text-xl text-text-dark mb-4">
          Ordini Recenti
          {period !== "sempre" && (
            <span className="text-sm font-normal text-text-medium ml-2">
              ({PERIOD_LABELS[period].toLowerCase()})
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-beige-dark">
                <th className="pb-3 text-sm font-semibold text-text-medium">Numero</th>
                <th className="pb-3 text-sm font-semibold text-text-medium">Cliente</th>
                <th className="pb-3 text-sm font-semibold text-text-medium">Data</th>
                <th className="pb-3 text-sm font-semibold text-text-medium">Totale</th>
                <th className="pb-3 text-sm font-semibold text-text-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-beige-light last:border-b-0"
                >
                  <td className="py-3 text-sm text-text-dark font-medium">
                    {order.numero_ordine}
                  </td>
                  <td className="py-3 text-sm text-text-dark">
                    {order.cliente_nome}
                  </td>
                  <td className="py-3 text-sm text-text-medium">
                    {new Date(order.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="py-3 text-sm text-text-dark">
                    &euro;{Number(order.totale).toFixed(2)}
                  </td>
                  <td className="py-3">
                    <StatusBadge stato={order.stato} />
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-medium text-sm">
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
