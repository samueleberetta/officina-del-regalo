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

type ViewMode = "tabella" | "kanban";
type StatusFilter = "Tutti" | "In lavorazione" | "Spedito" | "Consegnato";

const STATI: ("In lavorazione" | "Spedito" | "Consegnato")[] = [
  "In lavorazione",
  "Spedito",
  "Consegnato",
];

const STATO_COLORS: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  "In lavorazione": {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-400",
  },
  Spedito: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-400",
  },
  Consegnato: {
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-400",
  },
};

function StatusBadge({ stato }: { stato: string }) {
  const colors = STATO_COLORS[stato]?.badge ?? "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors}`}>
      {stato}
    </span>
  );
}

function OrdiniContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("Tutti");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tabella");
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
  }, []);

  const filters: StatusFilter[] = ["Tutti", "In lavorazione", "Spedito", "Consegnato"];

  const filteredOrders =
    filter === "Tutti" ? orders : orders.filter((o) => o.stato === filter);

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = async (orderId: string, newStato: string) => {
    await fetch("/api/orders/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, stato: newStato }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, stato: newStato } : o))
    );
  };

  // Drag & drop handlers
  const handleDragStart = (orderId: string) => {
    setDraggedOrder(orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStato: string) => {
    e.preventDefault();
    if (draggedOrder) {
      const order = orders.find((o) => o.id === draggedOrder);
      if (order && order.stato !== targetStato) {
        updateOrderStatus(draggedOrder, targetStato);
      }
    }
    setDraggedOrder(null);
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
  };

  return (
    <div className="min-h-screen bg-beige-light p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="font-heading text-3xl text-text-dark">Gestione Ordini</h1>

        {/* View toggle */}
        <div className="flex bg-white rounded-full shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setViewMode("tabella")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
              viewMode === "tabella"
                ? "bg-[#B8976A] text-white"
                : "text-[#6B6B6B] hover:text-[#2C2C2C]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
            Tabella
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
              viewMode === "kanban"
                ? "bg-[#B8976A] text-white"
                : "text-[#6B6B6B] hover:text-[#2C2C2C]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Kanban
          </button>
        </div>
      </div>

      {viewMode === "tabella" ? (
        <>
          {/* Filter buttons */}
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

          {/* Table view */}
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
        </>
      ) : (
        /* Kanban view */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATI.map((stato) => {
            const columnOrders = orders.filter((o) => o.stato === stato);
            const colors = STATO_COLORS[stato];

            return (
              <div
                key={stato}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stato)}
                className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-4 min-h-[400px] transition ${
                  draggedOrder ? "border-dashed" : ""
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                    <h3 className="font-bold text-[#2C2C2C] text-sm">{stato}</h3>
                  </div>
                  <span className={`${colors.badge} text-xs font-bold px-2 py-0.5 rounded-full`}>
                    {columnOrders.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {columnOrders.map((order) => (
                    <KanbanCard
                      key={order.id}
                      order={order}
                      onDragStart={() => handleDragStart(order.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedOrder === order.id}
                      onStatusChange={updateOrderStatus}
                      selectedOrder={selectedOrder}
                      onSelect={() => handleRowClick(order.id)}
                    />
                  ))}

                  {columnOrders.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <p className="text-sm text-[#6B6B6B]">
                        Trascina qui un ordine
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  order,
  onDragStart,
  onDragEnd,
  isDragging,
  onStatusChange,
  selectedOrder,
  onSelect,
}: {
  order: Order;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onStatusChange: (id: string, stato: string) => void;
  selectedOrder: string | null;
  onSelect: () => void;
}) {
  const prodotti = Array.isArray(order.prodotti) ? order.prodotti : [];
  const isExpanded = selectedOrder === order.id;

  // Determine which states this order can move to
  const currentIndex = STATI.indexOf(order.stato as typeof STATI[number]);
  const canMoveForward = currentIndex < STATI.length - 1;
  const canMoveBack = currentIndex > 0;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-40 scale-95" : "hover:shadow-md"
      }`}
    >
      <div className="p-4" onClick={onSelect}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-bold text-[#B8976A]">
            {order.numero_ordine}
          </span>
          <span className="text-xs text-[#6B6B6B]">
            {new Date(order.created_at).toLocaleDateString("it-IT")}
          </span>
        </div>

        <p className="font-semibold text-sm text-[#2C2C2C] mb-1">
          {order.cliente_nome}
        </p>

        <p className="text-lg font-bold text-[#2C2C2C]">
          &euro;{Number(order.totale).toFixed(2)}
        </p>

        {prodotti.length > 0 && (
          <p className="text-xs text-[#6B6B6B] mt-2">
            {prodotti.length} {prodotti.length === 1 ? "prodotto" : "prodotti"}
          </p>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-bold text-[#2C2C2C] mb-1">Prodotti</p>
            <ul className="space-y-0.5">
              {prodotti.map((p, idx) => (
                <li key={idx} className="text-xs text-[#6B6B6B] flex justify-between">
                  <span>{p.nome} &times; {p.quantita}</span>
                  <span>&euro;{(p.prezzo * p.quantita).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2C2C2C] mb-1">Spedizione</p>
            <p className="text-xs text-[#6B6B6B]">
              {order.indirizzo}, {order.cap} {order.citta}<br />
              {order.cliente_email}
            </p>
          </div>
        </div>
      )}

      {/* Move buttons */}
      <div className="border-t border-gray-100 px-4 py-2 flex justify-between">
        {canMoveBack ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, STATI[currentIndex - 1]);
            }}
            className="text-xs text-[#6B6B6B] hover:text-[#2C2C2C] flex items-center gap-1 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {STATI[currentIndex - 1]}
          </button>
        ) : (
          <span />
        )}
        {canMoveForward && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, STATI[currentIndex + 1]);
            }}
            className="text-xs text-[#B8976A] hover:text-[#2C2C2C] flex items-center gap-1 font-semibold transition"
          >
            {STATI[currentIndex + 1]}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
