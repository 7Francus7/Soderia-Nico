"use client";

import { useState } from "react";
import { Search, MessageCircle, DollarSign, Eye, CreditCard, Droplets, ArrowRight, CheckCircle, TrendingDown, X } from "lucide-react";
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
              toast.success("Resumen enviado a WhatsApp");
       };

       return (
              <div className="space-y-6">
                     <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Filtrar por nombre o dirección..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                            />
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="py-20 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] glass-card">
                                          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                          <p className="text-xl font-black text-emerald-500 italic uppercase">¡Todos los clientes están al día!</p>
                                   </div>
                            ) : (
                                   filtered.map((client, idx) => (
                                          <div
                                                 key={client.id}
                                                 className="bg-card border border-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-primary/20 transition-all animate-fade-in-up"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="flex items-center gap-6 w-full md:w-auto">
                                                        <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center shrink-0">
                                                               <CreditCard className="w-8 h-8 opacity-40" />
                                                        </div>
                                                        <div className="min-w-0">
                                                               <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors truncate">
                                                                      {client.name}
                                                               </h3>
                                                               <div className="text-sm font-bold text-muted-foreground truncate">{client.address}</div>
                                                               {client.phone && <div className="text-xs font-black text-primary/60 mt-1 uppercase tracking-widest">{client.phone}</div>}
                                                        </div>
                                                 </div>

                                                 <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto">
                                                        <div className="flex gap-8 text-right w-full sm:w-auto justify-between sm:justify-end">
                                                               {client.bottlesBalance !== 0 && (
                                                                      <div className="space-y-1">
                                                                             <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Envases</p>
                                                                             <div className={cn(
                                                                                    "text-xl font-black",
                                                                                    client.bottlesBalance > 0 ? "text-amber-500" : "text-emerald-500"
                                                                             )}>
                                                                                    {client.bottlesBalance > 0 ? `+${client.bottlesBalance}` : client.bottlesBalance}
                                                                             </div>
                                                                      </div>
                                                               )}
                                                               <div className="space-y-1">
                                                                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">Saldo Deuda</p>
                                                                      <div className="text-3xl font-black text-rose-500">
                                                                             ${client.balance.toLocaleString()}
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-2 w-full sm:w-auto">
                                                               <Button
                                                                      onClick={() => setSummaryClient(client)}
                                                                      variant="outline"
                                                                      className="h-12 w-12 rounded-xl border-white/10 glass-card"
                                                               >
                                                                      <Eye className="w-5 h-5" />
                                                               </Button>
                                                               <Button
                                                                      onClick={() => handleWhatsApp(client)}
                                                                      variant="outline"
                                                                      className="h-12 w-12 rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                                                               >
                                                                      <MessageCircle className="w-5 h-5" />
                                                               </Button>
                                                               <Button
                                                                      onClick={() => setSelectedClient(client)}
                                                                      className="flex-1 sm:flex-none h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
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
                            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">
                                          <div className="p-8 pb-4 flex justify-between items-center">
                                                 <div>
                                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Detalles de Cuenta</h3>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{summaryClient.name}</p>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setSummaryClient(null)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <div className="p-8 space-y-6">
                                                 <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10">
                                                               <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60 mb-1">Saldo Deudor</p>
                                                               <div className="text-3xl font-black text-rose-500">${summaryClient.balance.toLocaleString()}</div>
                                                        </div>
                                                        <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
                                                               <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 mb-1">Envases</p>
                                                               <div className="text-3xl font-black text-amber-500">{summaryClient.bottlesBalance} <span className="text-xs">unid.</span></div>
                                                        </div>
                                                 </div>

                                                 <div className="space-y-3">
                                                        <Link href={`/clientes/${summaryClient.id}`} className="block">
                                                               <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 glass-card font-black uppercase tracking-widest text-xs">
                                                                      <Eye className="w-4 h-4 mr-2" />
                                                                      VER HISTORIAL COMPLETO
                                                               </Button>
                                                        </Link>
                                                        <Button
                                                               onClick={() => handleWhatsApp(summaryClient)}
                                                               className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
                                                        >
                                                               <MessageCircle className="w-5 h-5 mr-2" />
                                                               COMPARTIR POR WHATSAPP
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

