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
                     <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Filtrar por nombre o dirección..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-11 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-white/15 transition-all text-white placeholder:text-white/20"
                            />
                     </div>

                     {/* List */}
                     <div className="space-y-3">
                            {filtered.length === 0 ? (
                                   <div className="py-16 text-center bg-white/5 border border-white/10 rounded-[2rem]">
                                          <CheckCircle className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
                                          <p className="text-base font-black text-white/30 italic uppercase tracking-widest">¡Todos al día!</p>
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
                     {summaryClient && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xl text-white">
                                   <div className="bg-card w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                                          <div className="p-5 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                                               <Eye className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-lg font-black italic uppercase tracking-tighter">Detalles</h3>
                                                               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{summaryClient.name}</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setSummaryClient(null)} className="rounded-xl hover:bg-white/5">
                                                        <X className="w-5 h-5" />
                                                 </Button>
                                          </div>

                                          <div className="p-5 space-y-5">
                                                 <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 relative overflow-hidden">
                                                               <div className="absolute top-0 left-0 w-full h-0.5 bg-rose-500/40" />
                                                               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">Saldo Deudor</p>
                                                               <div className="text-2xl font-black text-white tracking-tighter">${summaryClient.balance.toLocaleString()}</div>
                                                        </div>
                                                        <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 relative overflow-hidden">
                                                               <div className="absolute top-0 left-0 w-full h-0.5 bg-amber-500/40" />
                                                               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Envases</p>
                                                               <div className="text-2xl font-black text-white tracking-tighter">{summaryClient.bottlesBalance} <span className="text-xs opacity-30">unid.</span></div>
                                                        </div>
                                                 </div>

                                                 <div className="space-y-2">
                                                        <Link href={`/clientes/${summaryClient.id}`} className="block">
                                                               <Button variant="ghost" className="w-full h-12 rounded-xl border border-white/10 font-black uppercase tracking-widest text-xs hover:bg-white/5">
                                                                      <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                                                                      Ver Historial Completo
                                                               </Button>
                                                        </Link>
                                                        <Button
                                                               onClick={() => handleWhatsApp(summaryClient)}
                                                               className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-sm border-none"
                                                        >
                                                               <MessageCircle className="w-4 h-4 mr-2" />
                                                               Enviar por WhatsApp
                                                        </Button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}

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
                     className="bg-card border border-white/5 rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-6 hover:border-white/15 transition-all group shadow-xl shadow-black/10"
                     style={{ animationDelay: `${idx * 0.04}s` }}
              >
                     {/* Top row: avatar + info + amounts */}
                     <div className="flex items-start gap-3 sm:gap-5">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/10 transition-colors">
                                   <User className="w-5 h-5 sm:w-7 sm:h-7 text-white/20 group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex-1 min-w-0">
                                   <h3 className="text-base sm:text-xl font-black tracking-tighter text-white truncate">{client.name}</h3>
                                   <div className="text-[9px] sm:text-xs font-bold text-white/30 italic mt-0.5 truncate">{client.address}</div>
                                   {client.phone && <div className="text-[9px] font-black text-primary uppercase tracking-wider mt-1">{client.phone}</div>}
                            </div>

                            {/* Amounts - right aligned */}
                            <div className="text-right shrink-0">
                                   {client.bottlesBalance !== 0 && (
                                          <div className="mb-1">
                                                 <p className="text-[8px] font-black uppercase tracking-wide text-amber-500">Envases</p>
                                                 <div className={cn(
                                                        "text-sm font-black tracking-tighter",
                                                        client.bottlesBalance > 0 ? "text-white" : "text-emerald-500"
                                                 )}>
                                                        {client.bottlesBalance > 0 ? `+${client.bottlesBalance}` : client.bottlesBalance}
                                                 </div>
                                          </div>
                                   )}
                                   <p className="text-[8px] font-black uppercase tracking-wide text-rose-500">Deuda</p>
                                   <div className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                                          ${client.balance.toLocaleString()}
                                   </div>
                            </div>
                     </div>

                     {/* Action buttons */}
                     <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                            <Button
                                   onClick={onDetail}
                                   variant="outline"
                                   className="h-9 w-9 rounded-xl border-white/10 hover:bg-white/5 text-white/40 hover:text-white transition-all p-0"
                            >
                                   <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                                   onClick={onWhatsApp}
                                   variant="outline"
                                   className="h-9 w-9 rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 transition-all p-0"
                            >
                                   <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                   onClick={onPay}
                                   className="flex-1 h-9 rounded-xl bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-xs border-none active:scale-95"
                            >
                                   <DollarSign className="w-3.5 h-3.5 mr-1" />
                                   COBRAR
                            </Button>
                     </div>
              </div>
       );
}
