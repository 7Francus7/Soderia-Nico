"use client";

import { useState } from "react";
import { Search, Filter, Phone, MapPin, ChevronRight, MoreVertical, CreditCard, Droplets, Trash2, Edit, MessageCircle } from "lucide-react";
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
                     className="group relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up"
                     style={{ animationDelay: `${delay}s` }}
              >
                     <Link href={`/clientes/${client.id}`} className="block p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                   <div className="space-y-1 overflow-hidden">
                                          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors truncate">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                                 <MapPin className="w-4 h-4 shrink-0" />
                                                 <span className="truncate">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                          <ChevronRight className="w-5 h-5" />
                                   </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                   <div className={cn(
                                          "p-4 rounded-2xl border transition-all",
                                          hasDebt ? "bg-rose-500/5 border-rose-500/20 text-rose-500" : "bg-muted/10 border-white/5 opacity-50"
                                   )}>
                                          <div className="flex items-center gap-2 mb-1">
                                                 <CreditCard className="w-3.5 h-3.5" />
                                                 <span className="text-[10px] font-black uppercase tracking-widest">Saldo Deuda</span>
                                          </div>
                                          <div className="text-xl font-black">${client.balance.toLocaleString()}</div>
                                   </div>

                                   <div className={cn(
                                          "p-4 rounded-2xl border transition-all",
                                          hasBottles ? "bg-amber-500/5 border-amber-500/20 text-amber-500" : "bg-muted/10 border-white/5 opacity-50"
                                   )}>
                                          <div className="flex items-center gap-2 mb-1">
                                                 <Droplets className="w-3.5 h-3.5" />
                                                 <span className="text-[10px] font-black uppercase tracking-widest">Envases</span>
                                          </div>
                                          <div className="text-xl font-black">{client.bottlesBalance} <span className="text-xs">unid.</span></div>
                                   </div>
                            </div>
                     </Link>

                     <div className="px-8 pb-8 flex items-center justify-between text-muted-foreground text-xs font-bold">
                            <div className="flex items-center gap-2 overflow-hidden">
                                   {client.phone && (
                                          <div className="flex items-center gap-1 truncate">
                                                 <Phone className="w-3 h-3" />
                                                 {client.phone}
                                          </div>
                                   )}
                            </div>
                            <div className="flex gap-2 shrink-0 ml-4">
                                   <Button
                                          onClick={handleWhatsApp}
                                          variant="ghost"
                                          size="icon"
                                          className="h-9 w-9 rounded-xl border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                                   >
                                          <MessageCircle className="w-5 h-5" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-white/5 hover:bg-muted">
                                          <Edit className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-white/5 hover:text-destructive hover:bg-destructive/10">
                                          <Trash2 className="w-4 h-4" />
                                   </Button>
                            </div>
                     </div>
              </Card>
       );
}
