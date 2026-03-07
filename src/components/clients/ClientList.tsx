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
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Filtrar por nombre, calle..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full h-14 bg-neutral-900/40 backdrop-blur-3xl border border-white/5 rounded-2xl pl-12 pr-4 font-bold text-base text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/20"
                                   />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                                   {/* View Toggle */}
                                   <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-xl backdrop-blur-md shrink-0">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn(
                                                        "p-2.5 rounded-lg transition-all duration-300",
                                                        viewMode === "grid" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"
                                                 )}
                                          >
                                                 <LayoutGrid className="w-4 h-4" />
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn(
                                                        "p-2.5 rounded-lg transition-all duration-300",
                                                        viewMode === "table" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"
                                                 )}
                                          >
                                                 <List className="w-4 h-4" />
                                          </button>
                                   </div>

                                   {/* Sort Button */}
                                   <button
                                          onClick={toggleSort}
                                          className={cn(
                                                 "h-10 px-5 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap shrink-0",
                                                 currentSort === "debt"
                                                        ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                          )}
                                   >
                                          {currentSort === "debt" ? "▼ Mayor Deuda" : "A–Z Nombre"}
                                   </button>

                                   <div className="ml-auto shrink-0 text-[9px] font-black uppercase tracking-widest text-white/20">
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
                                          className="py-20 text-center rounded-[2rem] bg-neutral-900/20 border border-dashed border-white/10"
                                   >
                                          <Users className="w-12 h-12 mx-auto mb-4 text-white/5" />
                                          <p className="font-black uppercase tracking-[0.25em] text-white/20 text-sm">Sin resultados</p>
                                   </motion.div>
                            ) : viewMode === "grid" ? (
                                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                          {filteredClients.map((client, idx) => (
                                                 <motion.div
                                                        key={client.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                                                 >
                                                        <ClientGridCard client={client} />
                                                 </motion.div>
                                          ))}
                                   </div>
                            ) : (
                                   /* Table view - scrollable on mobile */
                                   <div className="border border-white/5 rounded-[2rem] overflow-hidden bg-neutral-950/40 backdrop-blur-3xl shadow-2xl">
                                          <div className="overflow-x-auto">
                                                 <table className="w-full text-left min-w-[500px]">
                                                        <thead className="bg-white/5">
                                                               <tr>
                                                                      <th className="p-4 sm:p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.35em]">Cliente</th>
                                                                      <th className="p-4 sm:p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.35em]">Balance</th>
                                                                      <th className="p-4 sm:p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.35em] hidden sm:table-cell">Envases</th>
                                                                      <th className="p-4 sm:p-6 text-right"></th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                               {filteredClients.map((client) => (
                                                                      <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                                                                             <td className="p-4 sm:p-6">
                                                                                    <Link href={`/clientes/${client.id}`} className="block">
                                                                                           <div className="font-black text-base sm:text-xl text-white italic group-hover:translate-x-2 transition-transform duration-300">{client.name}</div>
                                                                                           <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 flex items-center gap-1.5 mt-1">
                                                                                                  <MapPin className="w-2.5 h-2.5 text-white/40 shrink-0" />
                                                                                                  <span className="truncate max-w-[140px]">{client.address}</span>
                                                                                           </div>
                                                                                    </Link>
                                                                             </td>
                                                                             <td className="p-4 sm:p-6">
                                                                                    <div className={cn(
                                                                                           "text-lg sm:text-2xl font-black tracking-tighter tabular-nums",
                                                                                           client.balance > 0 ? "text-rose-500" : "text-emerald-500"
                                                                                    )}>
                                                                                           ${client.balance.toLocaleString()}
                                                                                    </div>
                                                                             </td>
                                                                             <td className="p-4 sm:p-6 hidden sm:table-cell">
                                                                                    <div className="text-lg font-black text-white/40 tracking-tighter">
                                                                                           {client.bottlesBalance} <span className="text-[9px] uppercase tracking-widest opacity-30">unid</span>
                                                                                    </div>
                                                                             </td>
                                                                             <td className="p-4 sm:p-6 text-right">
                                                                                    <Link href={`/clientes/${client.id}`}>
                                                                                           <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full border border-white/5 hover:bg-white hover:text-black transition-all">
                                                                                                  <ChevronRight className="w-4 h-4" />
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
                            "p-5 sm:p-7 h-full rounded-[2rem] sm:rounded-[2.5rem] border bg-neutral-900/40 backdrop-blur-3xl transition-all duration-500 hover:border-white/10 flex flex-col justify-between overflow-hidden relative",
                            hasDebt ? "border-rose-500/20" : "border-white/5"
                     )}>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                   <div className="space-y-2 min-w-0 flex-1 pr-3">
                                          <div className="flex items-center gap-2 flex-wrap">
                                                 <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", hasDebt ? "bg-rose-500" : "bg-emerald-500")} />
                                                 <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20">#{client.id}</span>
                                                 <ClientTagBadge tag={client.tag} size="sm" />
                                          </div>
                                          <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase italic leading-tight group-hover:scale-[1.02] origin-left transition-transform duration-300">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
                                                 <MapPin className="w-3 h-3 text-primary shrink-0" />
                                                 <span className="truncate">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all shrink-0">
                                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                   </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                   <div className={cn(
                                          "p-4 rounded-xl border flex flex-col justify-between transition-all duration-500",
                                          hasDebt ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-white/5 border-white/10 text-white/60"
                                   )}>
                                          <DollarSign className="w-4 h-4 mb-3 opacity-40" />
                                          <div>
                                                 <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Saldo</div>
                                                 <div className="text-lg font-black tracking-tighter tabular-nums">${client.balance.toLocaleString()}</div>
                                          </div>
                                   </div>
                                   <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-white/60 flex flex-col justify-between">
                                          <Package className="w-4 h-4 mb-3 opacity-40" />
                                          <div>
                                                 <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Envases</div>
                                                 <div className="text-lg font-black tracking-tighter tabular-nums">{client.bottlesBalance}</div>
                                          </div>
                                   </div>
                            </div>

                            {/* Gloss */}
                            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 transition-all duration-700 group-hover:left-[150%]" />
                     </div>
              </Link>
       );
}

