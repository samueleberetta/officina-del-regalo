"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";

interface OrderProduct {
  nome: string;
  prezzo: number;
  quantita: number;
}

interface Order {
  id: string;
  numero_ordine: string;
  cliente_nome: string;
  cliente_email: string;
  indirizzo: string;
  citta: string;
  cap: string;
  prodotti: OrderProduct[];
  totale: number;
  stato: string;
  created_at: string;
}

type StatusFilter = "Tutti" | "In lavorazione" | "Spedito" | "Consegnato";

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

function OrdiniContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("Tutti");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
  }, []);

  const filters: StatusFilter[] = [
    "Tutti",
    "In lavorazione",
    "Spedito",
    "Consegnato",
  ];

  const filteredOrders =
    filter === "Tutti"
      ? orders
      : orders.filter((o) => o.stato === filter);

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-beige-light p-6 md:p-10">
      <h1 className="font-heading text-3xl text-text-dark mb-8">
        Gestione Ordini
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === f
                ? "bg-gold text-white"
                : "bg-white text-text-dark border border-beige-dark hover:border-gold"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
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
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={selectedOrder === order.id}
                  onClick={() => handleRowClick(order.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="text-center text-text-medium py-8">Nessun ordine trovato.</p>
        )}
      </div>
    </div>
  );
}

function OrderRow({
  order,
  isSelected,
  onClick,
}: {
  order: Order;
  isSelected: boolean;
  onClick: () => void;
}) {
  const prodotti = Array.isArray(order.prodotti) ? order.prodotti : [];

  return (
    <>
      <tr
        onClick={onClick}
        className="border-b border-beige-light last:border-b-0 cursor-pointer hover:bg-beige-light/50 transition"
      >
        <td className="py-3 text-sm text-text-dark font-medium">
          {order.numero_ordine}
        </td>
        <td className="py-3 text-sm text-text-dark">{order.cliente_nome}</td>
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
      {isSelected && (
        <tr>
          <td colSpan={5} className="bg-beige-light/30 px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-text-dark mb-2">Prodotti</h4>
                <ul className="space-y-1">
                  {prodotti.map((p, idx) => (
                    <li key={idx} className="text-sm text-text-medium flex justify-between">
                      <span>{p.nome} &times; {p.quantita}</span>
                      <span className="text-text-dark">&euro;{(p.prezzo * p.quantita).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-dark mb-2">Indirizzo di spedizione</h4>
                <p className="text-sm text-text-medium">
                  {order.cliente_nome}<br />
                  {order.indirizzo}<br />
                  {order.cap} {order.citta}<br />
                  {order.cliente_email}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrdiniPage() {
  return (
    <AdminGuard>
      <OrdiniContent />
    </AdminGuard>
  );
}
