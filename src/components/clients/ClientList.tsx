"use strict";
"use client";

import { useState, useMemo } from "react";
import {
       Search,
       MapPin,
       ChevronRight,
       LayoutGrid,
       List,
       ArrowUpRight,
       DollarSign,
       Package,
       Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClientTagBadge } from "@/components/clients/ClientTagSelector";

export default function ClientList({ initialClients }: { initialClients: any[] }) {
       const router = useRouter();
       const searchParams = useSearchParams();
       const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

       const currentSearch = searchParams.get("q") || "";
       const currentSort = searchParams.get("sort") || "name";

       const filteredClients = useMemo(() => {
              let result = [...initialClients];
              if (currentSearch) {
                     result = result.filter(c =>
                            c.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            c.address.toLowerCase().includes(currentSearch.toLowerCase())
                     );
              }
              if (currentSort === "debt") {
                     result.sort((a, b) => b.balance - a.balance);
              }
              return result;
       }, [initialClients, currentSearch, currentSort]);

       const handleSearch = (val: string) => {
              const params = new URLSearchParams(searchParams);
              if (val) params.set("q", val);
              else params.delete("q");
              router.push(`/clientes?${params.toString()}`, { scroll: false });
       };

       const toggleSort = () => {
              const params = new URLSearchParams(searchParams);
              if (params.get("sort") === "debt") params.delete("sort");
              else params.set("sort", "debt");
              router.push(`/clientes?${params.toString()}`, { scroll: false });
       };

       return (
              <div className="space-y-6">
                     {/* TOOLBAR */}
                     <div className="flex flex-col gap-3">
                            {/* Search Bar */}
                            <div className="relative group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar clientes por nombre, dirección..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60 shadow-sm"
                                   />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                   {/* View Toggle */}
                                   <div className="flex bg-muted p-1 rounded-lg border border-border shrink-0">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn(
                                                        "p-1.5 rounded-md transition-all duration-200",
                                                        viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                 )}
                                          >
                                                 <LayoutGrid className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn(
                                                        "p-1.5 rounded-md transition-all duration-200",
                                                        viewMode === "table" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                 )}
                                          >
                                                 <List className="w-3.5 h-3.5" />
                                          </button>
                                   </div>

                                   {/* Sort Button */}
                                   <button
                                          onClick={toggleSort}
                                          className={cn(
                                                 "h-9 px-4 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0",
                                                 currentSort === "debt"
                                                        ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                                                        : "bg-white border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                          )}
                                   >
                                          {currentSort === "debt" ? "▼ Mayor Deuda" : "A–Z Nombre"}
                                   </button>

                                   <div className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground/60">
                                          {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
                                   </div>
                            </div>
                     </div>

                     {/* CONTENT */}
                     <AnimatePresence mode="popLayout">
                            {filteredClients.length === 0 ? (
                                   <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="py-16 text-center rounded-xl bg-white border border-dashed border-border"
                                   >
                                          <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                                          <p className="font-semibold text-muted-foreground/40 text-sm italic">No se encontraron clientes</p>
                                   </motion.div>
                            ) : viewMode === "grid" ? (
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {filteredClients.map((client, idx) => (
                                                 <motion.div
                                                        key={client.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                                                 >
                                                        <ClientGridCard client={client} />
                                                 </motion.div>
                                          ))}
                                   </div>
                            ) : (
                                   /* Table view - scrollable on mobile */
                                   <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
                                          <div className="overflow-x-auto">
                                                 <table className="w-full text-left">
                                                        <thead>
                                                               <tr className="bg-muted/50 border-b border-border">
                                                                      <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente</th>
                                                                      <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Balance</th>
                                                                      <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Envases</th>
                                                                      <th className="p-4 text-right"></th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border">
                                                               {filteredClients.map((client) => (
                                                                      <tr key={client.id} className="group hover:bg-muted/30 transition-colors">
                                                                             <td className="p-4">
                                                                                    <Link href={`/clientes/${client.id}`} className="block">
                                                                                           <div className="font-semibold text-sm text-foreground">{client.name}</div>
                                                                                           <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                                                                  <MapPin className="w-3 h-3 shrink-0 opacity-60" />
                                                                                                  <span className="truncate max-w-[140px]">{client.address}</span>
                                                                                           </div>
                                                                                    </Link>
                                                                             </td>
                                                                             <td className="p-4">
                                                                                    <div className={cn(
                                                                                           "text-sm font-bold tabular-nums",
                                                                                           client.balance > 0 ? "text-rose-600" : "text-emerald-600"
                                                                                    )}>
                                                                                           ${client.balance.toLocaleString()}
                                                                                    </div>
                                                                             </td>
                                                                             <td className="p-4 hidden sm:table-cell">
                                                                                    <div className="text-sm font-medium text-muted-foreground">
                                                                                           {client.bottlesBalance} <span className="text-[10px] opacity-60">unid</span>
                                                                                    </div>
                                                                             </td>
                                                                             <td className="p-4 text-right">
                                                                                    <Link href={`/clientes/${client.id}`}>
                                                                                           <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full border border-border hover:bg-primary/10 hover:text-primary transition-all">
                                                                                                  <ChevronRight className="w-3.5 h-3.5" />
                                                                                           </Button>
                                                                                    </Link>
                                                                             </td>
                                                                      </tr>
                                                               ))}
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </div>
                            )}
                     </AnimatePresence>
              </div>
       );
}

function ClientGridCard({ client }: any) {
       const hasDebt = client.balance > 0;

       return (
              <Link href={`/clientes/${client.id}`} className="block h-full group">
                     <div className={cn(
                            "p-4 sm:p-5 h-full rounded-xl border bg-white transition-all duration-200 card-shadow hover:card-shadow-md flex flex-col justify-between overflow-hidden relative",
                            hasDebt ? "border-rose-100 ring-1 ring-rose-50/50" : "border-border"
                     )}>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                   <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                 <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", hasDebt ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
                                                 <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">#{client.id}</span>
                                                 <ClientTagBadge tag={client.tag} size="sm" />
                                          </div>
                                          <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground lowercase tracking-tight">
                                                 <MapPin className="w-3 h-3 text-primary shrink-0 opacity-70" />
                                                 <span className="truncate">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0">
                                          <ArrowUpRight className="w-4 h-4" />
                                   </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 relative z-10">
                                   <div className={cn(
                                          "p-3 rounded-lg border flex flex-col justify-between transition-all duration-200",
                                          hasDebt ? "bg-rose-50/50 border-rose-100 text-rose-600" : "bg-muted border-border text-foreground"
                                   )}>
                                          <DollarSign className="w-3.5 h-3.5 mb-2 opacity-50" />
                                          <div>
                                                 <div className="text-[8px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Saldo</div>
                                                 <div className="text-base font-bold tracking-tight tabular-nums">${client.balance.toLocaleString()}</div>
                                          </div>
                                   </div>
                                   <div className="p-3 rounded-lg border border-border bg-muted/60 text-foreground flex flex-col justify-between">
                                          <Package className="w-3.5 h-3.5 mb-2 opacity-50" />
                                          <div>
                                                 <div className="text-[8px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Envases</div>
                                                 <div className="text-base font-bold tracking-tight tabular-nums">{client.bottlesBalance}</div>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </Link>
       );
}
