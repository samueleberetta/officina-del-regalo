"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

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

interface PipelineStage {
  id: string;
  nome: string;
  colore: string; // tailwind color name: yellow, blue, green, purple, red, orange, pink, indigo
}

type ViewMode = "tabella" | "kanban";

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "in-lavorazione", nome: "In lavorazione", colore: "yellow" },
  { id: "spedito", nome: "Spedito", colore: "blue" },
  { id: "consegnato", nome: "Consegnato", colore: "green" },
];

const STAGE_STORAGE_KEY = "odr-pipeline-stages";

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; dot: string; borderActive: string }> = {
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400", borderActive: "border-yellow-400" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800", dot: "bg-blue-400", borderActive: "border-blue-400" },
  green: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800", dot: "bg-green-400", borderActive: "border-green-400" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800", dot: "bg-purple-400", borderActive: "border-purple-400" },
  red: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-800", dot: "bg-red-400", borderActive: "border-red-400" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800", dot: "bg-orange-400", borderActive: "border-orange-400" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", badge: "bg-pink-100 text-pink-800", dot: "bg-pink-400", borderActive: "border-pink-400" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-800", dot: "bg-indigo-400", borderActive: "border-indigo-400" },
};

const AVAILABLE_COLORS = Object.keys(COLOR_MAP);

function getColors(colore: string) {
  return COLOR_MAP[colore] || COLOR_MAP.yellow;
}

function loadStages(): PipelineStage[] {
  if (typeof window === "undefined") return DEFAULT_STAGES;
  const saved = localStorage.getItem(STAGE_STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { return DEFAULT_STAGES; }
  }
  return DEFAULT_STAGES;
}

function saveStages(stages: PipelineStage[]) {
  localStorage.setItem(STAGE_STORAGE_KEY, JSON.stringify(stages));
}

function StatusBadge({ stato, stages }: { stato: string; stages: PipelineStage[] }) {
  const stage = stages.find((s) => s.nome === stato);
  const colors = stage ? getColors(stage.colore) : COLOR_MAP.yellow;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
      {stato}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────

function OrdiniContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("Tutti");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tabella");
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [movedCards, setMovedCards] = useState<Set<string>>(new Set());
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [showStageModal, setShowStageModal] = useState(false);

  useEffect(() => {
    setStages(loadStages());
  }, []);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
  }, []);

  const filters = ["Tutti", ...stages.map((s) => s.nome)];

  const filteredOrders =
    filter === "Tutti" ? orders : orders.filter((o) => o.stato === filter);

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = useCallback(async (orderId: string, newStato: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.stato === newStato) return;

    const oldStato = order.stato;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, stato: newStato } : o))
    );

    // Trigger animation
    setMovedCards((prev) => new Set(prev).add(orderId));
    setTimeout(() => {
      setMovedCards((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }, 700);

    // Toast feedback
    toast.success(
      `${order.cliente_nome}: ${oldStato} → ${newStato}`,
      { icon: "📦", duration: 2500 }
    );

    await fetch("/api/orders/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, stato: newStato }),
    });
  }, [orders]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrder(orderId);
    e.dataTransfer.effectAllowed = "move";
    // Make the drag image semi-transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 100, 30);
    }
  };

  const handleDragOver = (e: React.DragEvent, stato: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(stato);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column (not entering a child)
    const relatedTarget = e.relatedTarget as Node | null;
    if (e.currentTarget instanceof HTMLElement && relatedTarget && !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStato: string) => {
    e.preventDefault();
    if (draggedOrder) {
      updateOrderStatus(draggedOrder, targetStato);
    }
    setDraggedOrder(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedOrder(null);
    setDragOverColumn(null);
  };

  const handleSaveStages = (newStages: PipelineStage[]) => {
    setStages(newStages);
    saveStages(newStages);
    setShowStageModal(false);
  };

  return (
    <div className="min-h-screen bg-beige-light p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="font-heading text-3xl text-text-dark">Gestione Ordini</h1>

        {/* View toggle + edit sections */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStageModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-[#6B6B6B] bg-white border border-gray-200 hover:border-[#B8976A] hover:text-[#B8976A] transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Modifica sezioni
          </button>

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
      </div>

      {viewMode === "tabella" ? (
        <>
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
                      stages={stages}
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
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        >
          {stages.map((stage, stageIdx) => {
            const columnOrders = orders.filter((o) => o.stato === stage.nome);
            const colors = getColors(stage.colore);
            const isDropTarget = dragOverColumn === stage.nome && draggedOrder !== null;
            const draggedOrderObj = draggedOrder ? orders.find((o) => o.id === draggedOrder) : null;
            const isDifferentColumn = draggedOrderObj?.stato !== stage.nome;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOver(e, stage.nome)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.nome)}
                className={`rounded-2xl border-2 p-4 min-h-[400px] transition-all duration-300 ${colors.bg} ${
                  isDropTarget && isDifferentColumn
                    ? `${colors.borderActive} scale-[1.02] shadow-lg`
                    : draggedOrder && isDifferentColumn
                    ? `${colors.border} border-dashed opacity-80`
                    : colors.border
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors.dot} ${
                      isDropTarget && isDifferentColumn ? "animate-pulse" : ""
                    }`} />
                    <h3 className="font-bold text-[#2C2C2C] text-sm">{stage.nome}</h3>
                  </div>
                  <span className={`${colors.badge} text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                    isDropTarget && isDifferentColumn ? "scale-110" : ""
                  }`}>
                    {columnOrders.length}
                  </span>
                </div>

                {/* Drop zone indicator */}
                {isDropTarget && isDifferentColumn && columnOrders.length === 0 && (
                  <div className={`border-2 border-dashed ${colors.borderActive} rounded-xl p-8 text-center mb-3 transition-all`}>
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      Rilascia qui
                    </p>
                  </div>
                )}

                {/* Cards */}
                <div className="space-y-3">
                  {columnOrders.map((order) => (
                    <KanbanCard
                      key={order.id}
                      order={order}
                      stages={stages}
                      stageIndex={stageIdx}
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedOrder === order.id}
                      justMoved={movedCards.has(order.id)}
                      onStatusChange={updateOrderStatus}
                      isExpanded={selectedOrder === order.id}
                      onSelect={() => handleRowClick(order.id)}
                    />
                  ))}

                  {columnOrders.length === 0 && !isDropTarget && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <p className="text-sm text-[#6B6B6B]">
                        {draggedOrder ? "Rilascia qui" : "Nessun ordine"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stage editor modal */}
      {showStageModal && (
        <StageEditorModal
          stages={stages}
          onSave={handleSaveStages}
          onClose={() => setShowStageModal(false)}
        />
      )}
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────

function KanbanCard({
  order,
  stages,
  stageIndex,
  onDragStart,
  onDragEnd,
  isDragging,
  justMoved,
  onStatusChange,
  isExpanded,
  onSelect,
}: {
  order: Order;
  stages: PipelineStage[];
  stageIndex: number;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  justMoved: boolean;
  onStatusChange: (id: string, stato: string) => void;
  isExpanded: boolean;
  onSelect: () => void;
}) {
  const prodotti = Array.isArray(order.prodotti) ? order.prodotti : [];
  const canMoveBack = stageIndex > 0;
  const canMoveForward = stageIndex < stages.length - 1;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-xl shadow-sm border cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging
          ? "opacity-30 scale-95 border-gray-300 rotate-1"
          : justMoved
          ? "kanban-card-enter kanban-card-flash border-[#B8976A] shadow-md"
          : "border-gray-100 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div className="p-4 cursor-pointer" onClick={onSelect}>
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
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
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
      </div>

      {/* Move buttons */}
      <div className="border-t border-gray-100 px-3 py-2 flex justify-between items-center">
        {canMoveBack ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, stages[stageIndex - 1].nome);
            }}
            className="text-xs text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-gray-100 flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {stages[stageIndex - 1].nome}
          </button>
        ) : (
          <span />
        )}
        {canMoveForward && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, stages[stageIndex + 1].nome);
            }}
            className="text-xs text-[#B8976A] hover:text-white hover:bg-[#B8976A] flex items-center gap-1 font-semibold px-2 py-1 rounded-lg transition-all active:scale-95"
          >
            {stages[stageIndex + 1].nome}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Table Row ────────────────────────────────────────────────

function OrderRow({
  order,
  stages,
  isSelected,
  onClick,
}: {
  order: Order;
  stages: PipelineStage[];
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
        <td className="py-3 text-sm text-text-dark font-medium">{order.numero_ordine}</td>
        <td className="py-3 text-sm text-text-dark">{order.cliente_nome}</td>
        <td className="py-3 text-sm text-text-medium">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </td>
        <td className="py-3 text-sm text-text-dark">
          &euro;{Number(order.totale).toFixed(2)}
        </td>
        <td className="py-3">
          <StatusBadge stato={order.stato} stages={stages} />
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

// ─── Stage Editor Modal ───────────────────────────────────────

function StageEditorModal({
  stages,
  onSave,
  onClose,
}: {
  stages: PipelineStage[];
  onSave: (stages: PipelineStage[]) => void;
  onClose: () => void;
}) {
  const [editStages, setEditStages] = useState<PipelineStage[]>([...stages]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("yellow");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const id = "stage-" + Date.now();
    setEditStages([...editStages, { id, nome: newName.trim(), colore: newColor }]);
    setNewName("");
    setNewColor("yellow");
  };

  const handleDelete = (id: string) => {
    if (editStages.length <= 1) {
      toast.error("Devi avere almeno una sezione");
      return;
    }
    setEditStages(editStages.filter((s) => s.id !== id));
  };

  const startEditing = (stage: PipelineStage) => {
    setEditingId(stage.id);
    setEditName(stage.nome);
    setEditColor(stage.colore);
  };

  const saveEditing = () => {
    if (!editName.trim() || !editingId) return;
    setEditStages(editStages.map((s) =>
      s.id === editingId ? { ...s, nome: editName.trim(), colore: editColor } : s
    ));
    setEditingId(null);
  };

  const moveStage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editStages.length) return;
    const updated = [...editStages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEditStages(updated);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-[#2C2C2C]">Modifica sezioni pipeline</h2>
            <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#2C2C2C] transition p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-[#6B6B6B] mt-1">Gestisci le colonne della vista Kanban</p>
        </div>

        {/* Existing stages */}
        <div className="p-6 space-y-3">
          {editStages.map((stage, idx) => {
            const colors = getColors(stage.colore);

            if (editingId === stage.id) {
              return (
                <div key={stage.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border-2 border-[#B8976A]">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                  />
                  <select
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
                  >
                    {AVAILABLE_COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button onClick={saveEditing} className="text-green-600 hover:text-green-800 font-bold text-sm px-2">
                    Salva
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[#6B6B6B] hover:text-[#2C2C2C] text-sm px-2">
                    Annulla
                  </button>
                </div>
              );
            }

            return (
              <div key={stage.id} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition group">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveStage(idx, -1)}
                    disabled={idx === 0}
                    className="text-[#6B6B6B] hover:text-[#2C2C2C] disabled:opacity-20 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveStage(idx, 1)}
                    disabled={idx === editStages.length - 1}
                    className="text-[#6B6B6B] hover:text-[#2C2C2C] disabled:opacity-20 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Color dot + name */}
                <div className={`w-4 h-4 rounded-full ${colors.dot} flex-shrink-0`} />
                <span className="flex-1 text-sm font-medium text-[#2C2C2C]">{stage.nome}</span>

                {/* Actions */}
                <button
                  onClick={() => startEditing(stage)}
                  className="text-[#6B6B6B] hover:text-[#B8976A] opacity-0 group-hover:opacity-100 transition text-xs font-medium"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(stage.id)}
                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-xs font-medium"
                >
                  Elimina
                </button>
              </div>
            );
          })}
        </div>

        {/* Add new stage */}
        <div className="px-6 pb-4">
          <p className="text-xs font-bold text-[#2C2C2C] mb-2">Aggiungi nuova sezione</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome sezione..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
            >
              {AVAILABLE_COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="bg-[#B8976A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              Aggiungi
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-[#6B6B6B] hover:text-[#2C2C2C] transition"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              onSave(editStages);
              toast.success("Sezioni aggiornate");
            }}
            className="px-6 py-2 rounded-full bg-[#B8976A] text-white text-sm font-medium hover:opacity-90 transition"
          >
            Salva modifiche
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdiniPage() {
  return (
    <AdminGuard>
      <OrdiniContent />
    </AdminGuard>
  );
}
