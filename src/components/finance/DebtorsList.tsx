"use client";

import { useState } from "react";
import { Search, MessageCircle, DollarSign, Eye, ArrowRight, CheckCircle, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import QuickPaymentModal from "./QuickPaymentModal";

export default function DebtorsList({ initialDebtors }: { initialDebtors: any[] }) {
       const [search, setSearch] = useState("");
       const [selectedClient, setSelectedClient] = useState<any>(null);
       const [summaryClient, setSummaryClient] = useState<any>(null);

       const filtered = initialDebtors.filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.address.toLowerCase().includes(search.toLowerCase())
       );

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
              <div className="space-y-4">
                     {/* Search */}
                     <div className="flex items-center gap-2 max-w-md">
                            <div className="relative group flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Filtrar morosos por nombre o dirección..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 shadow-sm"
                                   />
                            </div>
                            <div className="px-3 h-11 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{filtered.length}</span>
                            </div>
                     </div>

                     {/* List */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="col-span-full py-16 text-center bg-white border border-dashed border-border rounded-xl">
                                          <CheckCircle className="w-10 h-10 text-emerald-500/30 mx-auto mb-3" />
                                          <p className="font-semibold text-muted-foreground/40 text-sm italic">¡Todos los clientes están al día!</p>
                                   </div>
                            ) : (
                                   filtered.map((client, idx) => (
                                          <DebtorCard
                                                 key={client.id}
                                                 client={client}
                                                 idx={idx}
                                                 onPay={() => setSelectedClient(client)}
                                                 onDetail={() => setSummaryClient(client)}
                                                 onWhatsApp={() => handleWhatsApp(client)}
                                          />
                                   ))
                            )}
                     </div>

                     {/* Summary Modal */}
                     <AnimatePresence>
                            {summaryClient && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSummaryClient(null)} />
                                          <div className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                                                 <div className="px-5 py-4 flex justify-between items-center border-b border-border bg-slate-50">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                                                                      <Eye className="w-4.5 h-4.5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-base font-bold text-foreground leading-none">Detalles de Deuda</h3>
                                                                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">{summaryClient.name}</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setSummaryClient(null)} className="rounded-full w-8 h-8 border border-border">
                                                               <X className="w-4 h-4" />
                                                        </Button>
                                                 </div>

                                                 <div className="p-5 space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                               <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 relative overflow-hidden group">
                                                                      <p className="text-[9px] font-bold uppercase tracking-widest text-rose-500/70 mb-1">Saldo Deudor</p>
                                                                      <div className="text-2xl font-bold text-rose-600 tracking-tight tabular-nums">${summaryClient.balance.toLocaleString()}</div>
                                                               </div>
                                                               <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 relative overflow-hidden">
                                                                      <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500/70 mb-1">Envases</p>
                                                                      <div className="text-2xl font-bold text-amber-600 tracking-tight tabular-nums">{summaryClient.bottlesBalance} <span className="text-[10px] text-amber-500/40">unid.</span></div>
                                                               </div>
                                                        </div>

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
                                                                      Enviar por WhatsApp
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            )}
                     </AnimatePresence>

                     <QuickPaymentModal
                            client={selectedClient}
                            onClose={() => setSelectedClient(null)}
                     />
              </div>
       );
}

function DebtorCard({ client, idx, onPay, onDetail, onWhatsApp }: any) {
       return (
              <div
                     className="bg-white border border-border rounded-xl p-4 sm:p-5 card-shadow hover:card-shadow-md transition-all group animate-fade-in-up"
                     style={{ animationDelay: `${idx * 0.04}s` }}
              >
                     {/* Top row: avatar + info + amounts */}
                     <div className="flex items-start gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border group-hover:bg-primary group-hover:text-white transition-all">
                                   <User className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/50 group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex-1 min-w-0">
                                   <h3 className="text-base font-bold text-foreground leading-tight truncate">{client.name}</h3>
                                   <div className="text-[10px] font-medium text-muted-foreground truncate opacity-70 mt-0.5">{client.address}</div>
                                   {client.phone && <div className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1">{client.phone}</div>}
                            </div>

                            {/* Amounts */}
                            <div className="text-right shrink-0">
                                   {client.bottlesBalance !== 0 && (
                                          <div className="mb-0.5">
                                                 <div className={cn(
                                                        "text-[11px] font-bold tracking-tight",
                                                        client.bottlesBalance > 0 ? "text-amber-500" : "text-emerald-500"
                                                 )}>
                                                        {client.bottlesBalance > 0 ? `+${client.bottlesBalance}` : client.bottlesBalance} <span className="text-[8px] opacity-40">ENV.</span>
                                                 </div>
                                          </div>
                                   )}
                                   <div className="text-lg sm:text-xl font-bold text-rose-500 tracking-tight tabular-nums">
                                          ${client.balance.toLocaleString()}
                                   </div>
                            </div>
                     </div>

                     {/* Action buttons */}
                     <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                            <Button
                                   onClick={onDetail}
                                   variant="ghost"
                                   className="h-9 w-9 rounded-lg bg-muted border border-border text-muted-foreground hover:bg-white hover:text-primary transition-all p-0"
                            >
                                   <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                                   onClick={onWhatsApp}
                                   variant="ghost"
                                   className="h-9 w-9 rounded-lg bg-muted border border-border text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all p-0"
                            >
                                   <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                   onClick={onPay}
                                   className="flex-1 h-9 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-sm active:scale-95"
                            >
                                   <DollarSign className="w-3.5 h-3.5 mr-1" />
                                   COBRAR
                            </Button>
                     </div>
              </div>
       );
}
