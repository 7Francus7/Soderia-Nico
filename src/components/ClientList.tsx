"use client";

import { useState } from "react";
import { Search, Filter, Phone, MapPin, ChevronRight, MoreVertical, CreditCard, Droplets, Trash2, Edit, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ClientList({ initialClients }: { initialClients: any[] }) {
       const [clients, setClients] = useState(initialClients);
       const router = useRouter();
       const searchParams = useSearchParams();
       const currentSearch = searchParams.get("q") || "";

       const handleSearch = (val: string) => {
              const params = new URLSearchParams(searchParams);
              if (val) params.set("q", val);
              else params.delete("q");
              router.push(`/clientes?${params.toString()}`);
       };

       const toggleSort = () => {
              const params = new URLSearchParams(searchParams);
              if (params.get("sort") === "debt") params.delete("sort");
              else params.set("sort", "debt");
              router.push(`/clientes?${params.toString()}`);
       };

       return (
              <div className="space-y-6">
                     {/* Filters & Search */}
                     <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1 group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Buscar por nombre o dirección..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                                   />
                            </div>
                            <Button
                                   variant="outline"
                                   onClick={toggleSort}
                                   className={cn(
                                          "h-14 px-6 rounded-2xl border-white/10 glass-card font-black tracking-widest uppercase text-xs",
                                          searchParams.get("sort") === "debt" && "border-primary bg-primary/10 text-primary"
                                   )}
                            >
                                   <Filter className="w-4 h-4 mr-2" />
                                   {searchParams.get("sort") === "debt" ? "Ordenado por Deuda" : "Ordenar por Deuda"}
                            </Button>
                     </div>

                     {/* Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clients.length === 0 ? (
                                   <div className="col-span-full py-20 text-center bg-card/40 border border-white/10 rounded-[2.5rem] glass-card">
                                          <p className="text-xl font-bold opacity-50">No se encontraron clientes.</p>
                                   </div>
                            ) : (
                                   clients.map((client, idx) => (
                                          <ClientCard key={client.id} client={client} delay={idx * 0.05} />
                                   ))
                            )}
                     </div>
              </div>
       );
}

function ClientCard({ client, delay }: { client: any; delay: number }) {
       const hasDebt = client.balance > 0;
       const hasBottles = client.bottlesBalance > 0;

       const handleWhatsApp = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              const date = new Date().toLocaleDateString();
              let message = `*ESTADO DE CUENTA - SODERÍA NICO*\n`;
              message += `*Cliente:* ${client.name}\n`;
              message += `*Fecha:* ${date}\n`;
              message += `--------------------------------\n`;
              message += `*SALDO ACTUAL: $${client.balance.toLocaleString()}*\n`;
              if (client.bottlesBalance !== 0) {
                     message += `*Envases:* ${client.bottlesBalance} unid.\n`;
              }
              message += `--------------------------------\n`;
              message += `_Muchas gracias por elegirnos._`;

              const url = `https://wa.me/${client.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(message)}`;
              window.open(url, '_blank');
              toast.success("Resumen enviado a WhatsApp");
       };

       return (
              <Card
                     className="group relative overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up glass-card rounded-[2.5rem] border-white/5"
                     style={{ animationDelay: `${delay}s` }}
              >
                     <Link href={`/clientes/${client.id}`} className="block p-10 pb-6">
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-8">
                                   <div className="space-y-2 overflow-hidden flex-1">
                                          <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Ficha Permanente</span>
                                          </div>
                                          <h3 className="text-3xl font-black tracking-tightest group-hover:text-primary transition-colors truncate italic">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                                                 <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                                                 <span className="truncate">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-12 h-12 rounded-2.5xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shrink-0 shadow-2xl">
                                          <ChevronRight className="w-6 h-6" />
                                   </div>
                            </div>

                            {/* Status Badges Section */}
                            <div className="grid grid-cols-2 gap-5 mb-6">
                                   <div className={cn(
                                          "p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden",
                                          hasDebt
                                                 ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/5 lg:scale-105"
                                                 : "bg-muted/10 border-white/5 opacity-40 grayscale"
                                   )}>
                                          <div className="flex items-center gap-2 mb-2 relative z-10">
                                                 <CreditCard className="w-4 h-4" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Saldos Deuda</span>
                                          </div>
                                          <div className="text-3xl font-black tracking-tighter relative z-10">${client.balance.toLocaleString()}</div>
                                          {hasDebt && <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-12 h-12" /></div>}
                                   </div>

                                   <div className={cn(
                                          "p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden",
                                          hasBottles
                                                 ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/5 lg:scale-105"
                                                 : "bg-muted/10 border-white/5 opacity-40 grayscale"
                                   )}>
                                          <div className="flex items-center gap-2 mb-2 relative z-10">
                                                 <Droplets className="w-4 h-4" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Envases</span>
                                          </div>
                                          <div className="text-3xl font-black tracking-tighter relative z-10">{client.bottlesBalance}</div>
                                          <div className="absolute bottom-0 right-0 p-4 opacity-10 text-[8px] font-black uppercase tracking-widest">unidades</div>
                                   </div>
                            </div>
                     </Link>

                     {/* Footer Actions */}
                     <div className="px-10 pb-10 flex items-center justify-between text-muted-foreground">
                            <div className="flex items-center gap-3">
                                   {client.phone && (
                                          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-xs font-black tracking-tight text-foreground/60">
                                                 <Phone className="w-3.5 h-3.5 text-primary" />
                                                 {client.phone}
                                          </div>
                                   )}
                            </div>
                            <div className="flex gap-2.5 shrink-0">
                                   <Button
                                          onClick={handleWhatsApp}
                                          variant="ghost"
                                          size="icon"
                                          className="h-12 w-12 rounded-2xl border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 hover:scale-110 transition-all shadow-xl shadow-emerald-500/5 active:scale-90"
                                   >
                                          <MessageCircle className="w-6 h-6" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-white/5 hover:bg-muted active:scale-90 transition-all">
                                          <Edit className="w-5 h-5" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-white/5 hover:text-rose-500 hover:bg-rose-500/10 active:scale-90 transition-all">
                                          <Trash2 className="w-5 h-5" />
                                   </Button>
                            </div>
                     </div>
              </Card>
       );
}
