"use client";

import { useState } from "react";
import { Search, MessageCircle, DollarSign, Eye, ArrowRight, CheckCircle, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import QuickPaymentModal from "./QuickPaymentModal";
import QuickReturnModal from "./QuickReturnModal";

export default function DebtorsList({ initialDebtors }: { initialDebtors: any[] }) {
       const [search, setSearch] = useState("");
       const [activeFilter, setActiveFilter] = useState("all");
       const [sortBy, setSortBy] = useState("balance");
       const [selectedClient, setSelectedClient] = useState<any>(null);
       const [selectedReturnClient, setSelectedReturnClient] = useState<any>(null);
       const [summaryClient, setSummaryClient] = useState<any>(null);

       const filters = [
              { id: "all", label: "Todos" },
              { id: "debt", label: "Con deuda" },
              { id: "overdue", label: "Vencidos" },
              { id: "bottles", label: "Con envases" },
              { id: "route", label: "En ruta" },
       ];

       const filtered = initialDebtors
              .filter(c => {
                     const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.address.toLowerCase().includes(search.toLowerCase());
                     if (!matchesSearch) return false;

                     if (activeFilter === "debt") return c.balance > 0;
                     if (activeFilter === "overdue") return c.daysOverdue > 15;
                     if (activeFilter === "bottles") return c.bottlesBalance > 0;
                     if (activeFilter === "route") return c.inRoute;
                     return true;
              })
              .sort((a, b) => {
                     if (sortBy === "balance") return b.balance - a.balance;
                     if (sortBy === "mora") return b.daysOverdue - a.daysOverdue;
                     if (sortBy === "bottles") return b.bottlesBalance - a.bottlesBalance;
                     if (sortBy === "name") return a.name.localeCompare(b.name);
                     if (sortBy === "last_payment") {
                            const dateA = a.lastPaymentDate ? new Date(a.lastPaymentDate).getTime() : 0;
                            const dateB = b.lastPaymentDate ? new Date(b.lastPaymentDate).getTime() : 0;
                            return dateB - dateA;
                     }
                     return 0;
              });

       const handleWhatsApp = (client: any) => {
              const date = new Date().toLocaleDateString();
              let message = `*ESTADO DE CUENTA - SODERÍA NICO*\n`;
              message += `*Cliente:* ${client.name}\n`;
              message += `*Fecha:* ${date}\n`;
              message += `--------------------------------\n`;
              message += `*SALDO PENDIENTE: $${client.balance.toLocaleString()}*\n`;
              if (client.bottlesBalance !== 0) {
                     message += `*Envases:* ${client.bottlesBalance} unid.\n`;
              }
              message += `--------------------------------\n`;
              message += `_Recordatorio automático. ¡Muchas gracias!_`;
              const url = `https://wa.me/${client.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              toast.success("Mensaje enviado");
       };

       return (
              <div className="space-y-6">
                     {/* Search & Filters */}
                     <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                   <div className="relative group flex-1">
                                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                          <input
                                                 type="text"
                                                 placeholder="Buscar por nombre o dirección..."
                                                 value={search}
                                                 onChange={(e) => setSearch(e.target.value)}
                                                 className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
                                          />
                                   </div>

                                   <div className="flex items-center gap-2 bg-white p-1 border border-border rounded-xl overflow-x-auto min-w-[300px]">
                                          {filters.map(f => (
                                                 <button
                                                        key={f.id}
                                                        onClick={() => setActiveFilter(f.id)}
                                                        className={cn(
                                                               "px-4 h-9 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                                               activeFilter === f.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
                                                        )}
                                                 >
                                                        {f.label}
                                                 </button>
                                          ))}
                                   </div>
                            </div>

                            {/* Sorting */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                                   <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mr-2 whitespace-nowrap">Ordenar por:</span>
                                   {[
                                          { id: "balance", label: "Mayor Deuda" },
                                          { id: "mora", label: "Más Antiguos" },
                                          { id: "last_payment", label: "Último Pago" },
                                          { id: "bottles", label: "Más Envases" },
                                          { id: "name", label: "Nombre" }
                                   ].map(s => (
                                          <button
                                                 key={s.id}
                                                 onClick={() => setSortBy(s.id)}
                                                 className={cn(
                                                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap",
                                                        sortBy === s.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-muted-foreground border-border hover:border-slate-300"
                                                 )}
                                          >
                                                 {s.label}
                                          </button>
                                   ))}
                            </div>
                     </div>

                     {/* List */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="col-span-full py-16 text-center bg-white border border-dashed border-border rounded-xl">
                                          <CheckCircle className="w-10 h-10 text-emerald-500/30 mx-auto mb-3" />
                                          <p className="font-semibold text-muted-foreground/40 text-sm italic">Sin resultados para estos filtros.</p>
                                   </div>
                            ) : (
                                   filtered.map((client, idx) => (
                                          <DebtorCard
                                                 key={client.id}
                                                 client={client}
                                                 idx={idx}
                                                 onPay={() => setSelectedClient(client)}
                                                 onReturn={() => setSelectedReturnClient(client)}
                                                 onDetail={() => setSummaryClient(client)}
                                                 onWhatsApp={() => handleWhatsApp(client)}
                                          />
                                   ))
                            )}
                     </div>

                     {/* Summary Modal (Drawer on Mobile) */}
                     <AnimatePresence>
                            {summaryClient && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                                 onClick={() => setSummaryClient(null)}
                                          />
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                 className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 <div className="px-5 py-4 flex justify-between items-center border-b border-border bg-white sticky top-0 z-10">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                                                                      <Eye className="w-4.5 h-4.5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-base font-bold text-foreground leading-none">Detalles de Cuenta</h3>
                                                                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">{summaryClient.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setSummaryClient(null)} className="rounded-full w-8 h-8 border border-border">
                                                               <X className="w-4 h-4" />
                                                        </Button>
                                                 </div>

                                                 <div className="p-5 space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                               <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                                                      <p className="text-[9px] font-bold uppercase tracking-widest text-rose-500/70 mb-1">Saldo Actual</p>
                                                                      <div className="text-2xl font-bold text-rose-600 tabular-nums">${summaryClient.balance.toLocaleString()}</div>
                                                               </div>
                                                               <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                                      <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500/70 mb-1">Envases en Calle</p>
                                                                      <div className="text-2xl font-bold text-amber-600 tabular-nums">{summaryClient.bottlesBalance}</div>
                                                               </div>
                                                        </div>

                                                        {summaryClient.lastPaymentDate && (
                                                               <div className="px-1 text-[10px] text-muted-foreground">
                                                                      <span className="font-bold text-slate-400">Último pago:</span> {new Date(summaryClient.lastPaymentDate).toLocaleDateString()}
                                                               </div>
                                                        )}

                                                        <div className="space-y-2">
                                                               <Link href={`/clientes/${summaryClient.id}`} className="block">
                                                                      <Button variant="outline" className="w-full h-11 rounded-xl border-border font-bold uppercase tracking-widest text-[10px] hover:bg-muted group">
                                                                             Ver Historial Completo
                                                                             <ArrowRight className="w-3.5 h-3.5 ml-2 text-primary group-hover:translate-x-0.5 transition-transform" />
                                                                      </Button>
                                                               </Link>
                                                               <Button
                                                                      onClick={() => handleWhatsApp(summaryClient)}
                                                                      className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/10 border-none group"
                                                               >
                                                                      <MessageCircle className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                                                      Enviar Estado WhatsApp
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>

                     <QuickPaymentModal
                            client={selectedClient}
                            onClose={() => setSelectedClient(null)}
                     />
                     <QuickReturnModal
                            client={selectedReturnClient}
                            onClose={() => setSelectedReturnClient(null)}
                     />
              </div>
       );
}

function DebtorCard({ client, idx, onPay, onReturn, onDetail, onWhatsApp }: any) {
       // Determinar nivel de riesgo
       const getRiskColor = () => {
              if (client.balance <= 0) return "emerald";
              if (client.daysOverdue > 30) return "rose";
              if (client.daysOverdue > 15) return "orange";
              if (client.daysOverdue > 7) return "amber";
              return "blue";
       };

       const risk = getRiskColor();

       const colors: any = {
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              rose: "bg-rose-50 text-rose-600 border-rose-100",
              orange: "bg-orange-50 text-orange-600 border-orange-100",
              amber: "bg-amber-50 text-amber-600 border-amber-100",
              blue: "bg-blue-50 text-blue-600 border-blue-100",
       };

       return (
              <div
                     className="bg-white border border-border rounded-xl p-4 sm:p-5 card-shadow hover:card-shadow-md transition-all group animate-fade-in-up relative overflow-hidden"
                     style={{ animationDelay: `${idx * 0.04}s` }}
              >
                     {/* In Route Indicator */}
                     {client.inRoute && (
                            <div className="absolute top-0 right-0">
                                   <div className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest shadow-sm">
                                          En Ruta
                                   </div>
                            </div>
                     )}

                     <div className="flex items-start gap-4">
                            {/* Status Icon/Risk */}
                            <button
                                   onClick={onDetail}
                                   className={cn(
                                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform active:scale-90",
                                          colors[risk] || colors.blue
                                   )}
                            >
                                   {risk === "emerald" ? <CheckCircle className="w-6 h-6" /> : (
                                          <div className="flex flex-col items-center">
                                                 <span className="text-[14px] font-black leading-none">{client.daysOverdue}</span>
                                                 <span className="text-[7px] font-bold uppercase">Días</span>
                                          </div>
                                   )}
                            </button>

                            <div className="flex-1 min-w-0" onClick={onDetail} role="button">
                                   <h3 className="text-base font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">{client.name}</h3>
                                   <div className="text-[10px] font-medium text-muted-foreground truncate opacity-70 mt-0.5">{client.address}</div>
                                   {client.lastPaymentDate ? (
                                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                                 <CheckCircle className="w-2.5 h-2.5" />
                                                 Último pago: {new Date(client.lastPaymentDate).toLocaleDateString()}
                                          </div>
                                   ) : (
                                          <div className="text-[9px] font-bold text-rose-300 uppercase tracking-wider mt-1.5">Sin pagos registrados</div>
                                   )}
                            </div>

                            <div className="text-right shrink-0">
                                   <div className={cn(
                                          "text-xl sm:text-2xl font-black tracking-tighter tabular-nums",
                                          client.balance > 0 ? "text-rose-600" : "text-emerald-600"
                                   )}>
                                          ${client.balance.toLocaleString()}
                                   </div>
                                   {client.bottlesBalance !== 0 && (
                                          <div className={cn(
                                                 "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                                                 client.bottlesBalance > 0 ? "text-amber-500" : "text-emerald-500"
                                          )}>
                                                 {client.bottlesBalance} envases
                                          </div>
                                   )}
                            </div>
                     </div>

                     {/* Action buttons */}
                     <div className="flex items-center gap-2 mt-5">
                            <Button
                                   onClick={onWhatsApp}
                                   variant="outline"
                                   className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all p-0 order-2"
                            >
                                   <MessageCircle className="w-4.5 h-4.5" />
                            </Button>

                            {client.balance > 0 ? (
                                   <Button
                                          onClick={onPay}
                                          className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all order-1"
                                   >
                                          <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                                          COBRAR
                                   </Button>
                            ) : client.bottlesBalance > 0 ? (
                                   <Button
                                          onClick={onReturn}
                                          className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-amber-500/20 active:scale-95 transition-all order-1"
                                   >
                                          RETORNO ENVASES
                                   </Button>
                            ) : (
                                   <Button
                                          onClick={onDetail}
                                          variant="outline"
                                          className="flex-1 h-10 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] border-border hover:bg-slate-50 order-1"
                                   >
                                          VER ESTADO
                                   </Button>
                            )}
                     </div>
              </div>
       );
}

