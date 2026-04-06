"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { getProducts } from "@/lib/products";
import { mockOrders } from "@/data/orders";

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

function DashboardContent() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    setProductCount(getProducts().length);
  }, []);

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-beige-light p-6 md:p-10">
      <h1 className="font-heading text-3xl text-text-dark mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Totale Prodotti</p>
          <p className="text-3xl font-bold text-text-dark">{productCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Ordini Oggi</p>
          <p className="text-3xl font-bold text-text-dark">3</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-gold p-6">
          <p className="text-sm text-text-medium mb-1">Ricavi del Mese</p>
          <p className="text-3xl font-bold text-text-dark">&euro;1.247,00</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-heading text-xl text-text-dark mb-4">
          Ordini Recenti
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-beige-dark">
                <th className="pb-3 text-sm font-semibold text-text-medium">
                  Numero
                </th>
                <th className="pb-3 text-sm font-semibold text-text-medium">
                  Cliente
                </th>
                <th className="pb-3 text-sm font-semibold text-text-medium">
                  Data
                </th>
                <th className="pb-3 text-sm font-semibold text-text-medium">
                  Totale
                </th>
                <th className="pb-3 text-sm font-semibold text-text-medium">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-beige-light last:border-b-0"
                >
                  <td className="py-3 text-sm text-text-dark font-medium">
                    {order.numero}
                  </td>
                  <td className="py-3 text-sm text-text-dark">
                    {order.cliente}
                  </td>
                  <td className="py-3 text-sm text-text-medium">
                    {order.data}
                  </td>
                  <td className="py-3 text-sm text-text-dark">
                    &euro;{order.totale.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <StatusBadge stato={order.stato} />
                  </td>
                </tr>
              ))}
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
