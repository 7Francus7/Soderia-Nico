"use client";

import { useEffect, useState } from "react";
import {
       Activity,
       Truck,
       CreditCard,
       UserPlus,
       Clock,
       CheckCircle2,
       AlertCircle,
       ArrowUpRight,
       Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Simulated "Live" Activity based on the Monitor.tsx pattern
// In a real app, this would use Pusher or WebSockets
const mockActivities = [
       { id: 1, type: "ORDER", title: "Nuevo Pedido", detail: "Juan Perez - 2 Sodas + 1 Agua", time: "Hace 2 min", status: "PENDING" },
       { id: 2, type: "PAYMENT", title: "Cobranza Exitosa", detail: "Marta Gomez pagó $8.500", time: "Hace 5 min", status: "SUCCESS" },
       { id: 3, type: "CLIENT", title: "Nuevo Cliente", detail: "Restaurante 'El Gaucho' registrado", time: "Hace 15 min", status: "SUCCESS" },
       { id: 4, type: "ORDER", title: "Entrega Completada", detail: "Ruta Norte - Chofer: Carlos", time: "Hace 20 min", status: "SUCCESS" },
       { id: 5, type: "DEBT", title: "Deuda Pendiente", detail: "Súper Mercadito debe $45.000", time: "Hace 1 h", status: "WARNING" },
];

export default function LiveActivityMonitor() {
       const [activities, setActivities] = useState(mockActivities);
       const [isLive, setIsLive] = useState(true);

       // Pattern: Simulated live updates like Monitor.tsx (Tauri listen pattern)
       useEffect(() => {
              if (!isLive) return;

              const interval = setInterval(() => {
                     // Randomly "detect" new activity logic
              }, 5000);

              return () => clearInterval(interval);
       }, [isLive]);

       return (
              <Card className="glass-card border-white/5 rounded-[3rem] overflow-hidden flex flex-col h-[600px] shadow-2xl">
                     {/* Monitor Header */}
                     <div className="p-8 pb-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                   <div className="relative">
                                          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                 <Activity className="w-6 h-6" />
                                          </div>
                                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                                   </div>
                                   <div>
                                          <h3 className="text-2xl font-black tracking-tight italic">Live <span className="text-primary">Monitor</span></h3>
                                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Actividad del Sistema en tiempo real</p>
                                   </div>
                            </div>

                            <div className="flex items-center gap-2">
                                   <button
                                          onClick={() => setIsLive(!isLive)}
                                          className={cn(
                                                 "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                                 isLive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/5"
                                          )}
                                   >
                                          {isLive ? "● LIVE" : "PAUSED"}
                                   </button>
                            </div>
                     </div>

                     {/* Quick Filters - Pattern from Antigravity Manager */}
                     <div className="px-8 py-4 flex gap-3 border-b border-white/5 bg-slate-900/40">
                            <FilterChip label="Todo" active count={activities.length} />
                            <FilterChip label="Pedidos" count={2} />
                            <FilterChip label="Pagos" count={1} />
                            <FilterChip label="Clientes" count={1} />
                     </div>

                     {/* Activities List */}
                     <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                   {activities.map((activity) => (
                                          <motion.div
                                                 key={activity.id}
                                                 initial={{ opacity: 0, x: -20 }}
                                                 animate={{ opacity: 1, x: 0 }}
                                                 className="group flex items-center gap-5 p-5 bg-white/5 hover:bg-white/10 rounded-2.5xl border border-white/5 transition-all cursor-pointer relative overflow-hidden"
                                          >
                                                 <div className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110",
                                                        activity.status === "SUCCESS" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                                               activity.status === "WARNING" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                                                      "bg-primary/10 border-primary/20 text-primary"
                                                 )}>
                                                        {activity.type === "ORDER" && <Truck className="w-6 h-6" />}
                                                        {activity.type === "PAYMENT" && <CreditCard className="w-6 h-6" />}
                                                        {activity.type === "CLIENT" && <UserPlus className="w-6 h-6" />}
                                                        {activity.type === "DEBT" && <AlertCircle className="w-6 h-6" />}
                                                 </div>

                                                 <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                               <h4 className="font-black text-lg tracking-tight uppercase italic">{activity.title}</h4>
                                                               <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                                                                      <Clock className="w-3 h-3" />
                                                                      {activity.time}
                                                               </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-400 truncate">{activity.detail}</p>
                                                 </div>

                                                 <button className="opacity-0 group-hover:opacity-100 transition-all p-3 hover:bg-white/5 rounded-xl">
                                                        <ArrowUpRight className="w-5 h-5 text-primary" />
                                                 </button>
                                          </motion.div>
                                   ))}
                            </AnimatePresence>
                     </div>

                     {/* Footer */}
                     <div className="p-6 bg-slate-950/50 border-t border-white/5">
                            <div className="relative group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Buscar en logs..."
                                          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                   />
                            </div>
                     </div>
              </Card>
       );
}

function FilterChip({ label, active, count }: any) {
       return (
              <button className={cn(
                     "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                     active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-slate-500 hover:text-white hover:bg-white/10"
              )}>
                     {label}
                     {count && <span className={cn("px-1.5 py-0.5 rounded-md text-[8px]", active ? "bg-white/20" : "bg-white/10")}>{count}</span>}
              </button>
       );
}
