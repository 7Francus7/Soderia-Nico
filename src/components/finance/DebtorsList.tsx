"use client";

import { useState } from "react";
import { Search, MessageCircle, DollarSign, Eye, CreditCard, Droplets, ArrowRight, CheckCircle, TrendingDown, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
              message += `_Este es un recordatorio automático. Por favor, regularice su saldo a la brevedad. ¡Muchas gracias!_`;

              const url = `https://wa.me/${client.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              toast.success("Resumen compartido");
       };

       return (
              <div className="space-y-6">
                     <div className="relative group max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Filtrar por nombre o dirección..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-xl placeholder:text-white/20 text-white"
                            />
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="py-20 text-center bg-white/5 border border-white/10 rounded-[2.5rem] animate-fade-in">
                                          <CheckCircle className="w-16 h-16 text-emerald-500/40 mx-auto mb-6" />
                                          <p className="text-xl font-black text-white/40 italic uppercase tracking-widest">¡Todos los clientes al día!</p>
                                   </div>
                            ) : (
                                   filtered.map((client, idx) => (
                                          <div
                                                 key={client.id}
                                                 className="bg-card border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-white/20 transition-all animate-fade-in-up group shadow-2xl shadow-black/20"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="flex items-center gap-6 w-full md:w-auto">
                                                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/10 transition-colors">
                                                               <User className="w-10 h-10 text-white/20 group-hover:text-white transition-colors" />
                                                        </div>
                                                        <div className="min-w-0">
                                                               <h3 className="text-3xl font-black tracking-tighter text-white group-hover:translate-x-1 transition-transform truncate">
                                                                      {client.name}
                                                               </h3>
                                                               <div className="text-sm font-bold text-white/40 truncate italic mt-1">{client.address}</div>
                                                               {client.phone && <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">{client.phone}</div>}
                                                        </div>
                                                 </div>

                                                 <div className="flex flex-col sm:flex-row items-center gap-10 w-full md:w-auto">
                                                        <div className="flex gap-10 text-right w-full sm:w-auto justify-between sm:justify-end">
                                                               {client.bottlesBalance !== 0 && (
                                                                      <div className="space-y-1">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Envases</p>
                                                                             <div className={cn(
                                                                                    "text-2xl font-black tracking-tighter",
                                                                                    client.bottlesBalance > 0 ? "text-white" : "text-emerald-500"
                                                                             )}>
                                                                                    {client.bottlesBalance > 0 ? `+${client.bottlesBalance}` : client.bottlesBalance}
                                                                             </div>
                                                                      </div>
                                                               )}
                                                               <div className="space-y-1">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Saldo Deuda</p>
                                                                      <div className="text-4xl font-black tracking-tighter text-white">
                                                                             ${client.balance.toLocaleString()}
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-3 w-full sm:w-auto">
                                                               <Button
                                                                      onClick={() => setSummaryClient(client)}
                                                                      variant="outline"
                                                                      className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5 text-white/40 hover:text-white transition-all"
                                                               >
                                                                      <Eye className="w-6 h-6" />
                                                               </Button>
                                                               <Button
                                                                      onClick={() => handleWhatsApp(client)}
                                                                      variant="outline"
                                                                      className="h-14 w-14 rounded-2xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                                               >
                                                                      <MessageCircle className="w-6 h-6" />
                                                               </Button>
                                                               <Button
                                                                      onClick={() => setSelectedClient(client)}
                                                                      className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 border-none"
                                                               >
                                                                      <DollarSign className="w-4 h-4 mr-1" />
                                                                      COBRAR
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </div>
                                   ))
                            )}
                     </div>

                     {/* Summary Quick View */}
                     {summaryClient && (
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in text-white">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">
                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <Eye className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black italic uppercase tracking-tighter">Detalles de Cuenta</h3>
                                                               <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{summaryClient.name}</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setSummaryClient(null)} className="rounded-2xl hover:bg-white/5">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <div className="p-8 space-y-8">
                                                 <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                                                               <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/40" />
                                                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">Saldo Deudor</p>
                                                               <div className="text-4xl font-black text-white tracking-tighter shadow-sm">${summaryClient.balance.toLocaleString()}</div>
                                                        </div>
                                                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                                                               <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/40" />
                                                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Envases</p>
                                                               <div className="text-4xl font-black text-white tracking-tighter shadow-sm">{summaryClient.bottlesBalance} <span className="text-xs opacity-30">UNID.</span></div>
                                                        </div>
                                                 </div>

                                                 <div className="space-y-4 pt-2">
                                                        <Link href={`/clientes/${summaryClient.id}`} className="block">
                                                               <Button variant="ghost" className="w-full h-16 rounded-2xl border border-white/10 font-black uppercase tracking-widest text-xs hover:bg-white/5">
                                                                      <ArrowRight className="w-5 h-5 mr-3 text-primary animate-pulse" />
                                                                      VER HISTORIAL COMPLETO
                                                               </Button>
                                                        </Link>
                                                        <Button
                                                               onClick={() => handleWhatsApp(summaryClient)}
                                                               className="w-full h-16 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-sm shadow-2xl transition-all active:scale-95 border-none"
                                                        >
                                                               <MessageCircle className="w-5 h-5 mr-3" />
                                                               ENVIAR POR WHATSAPP
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
