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
       Users,
       TrendingUp,
       Activity,
       CreditCard
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
              <div className="space-y-10 animate-fade-in-up">

                     {/* PREMIUM iOS TOOLBAR */}
                     <header className="flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                                 <Users className="w-3.5 h-3.5" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Base de Datos</span>
                                          </div>
                                          <h1 className="text-4xl font-black tracking-tight text-foreground leading-tight px-1">Clientes</h1>
                                   </div>

                                   <div className="flex bg-slate-50/50 p-1.5 rounded-[1.4rem] border border-slate-100 shadow-inner shrink-0">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn(
                                                        "px-5 py-2.5 rounded-[1rem] flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest",
                                                        viewMode === "grid" ? "bg-white text-primary shadow-lg shadow-primary/5" : "text-slate-400 hover:text-slate-600"
                                                 )}
                                          >
                                                 <LayoutGrid className="w-3.5 h-3.5" />
                                                 Cuadrícula
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn(
                                                        "px-5 py-2.5 rounded-[1rem] flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest",
                                                        viewMode === "table" ? "bg-white text-primary shadow-lg shadow-primary/5" : "text-slate-400 hover:text-slate-600"
                                                 )}
                                          >
                                                 <List className="w-3.5 h-3.5" />
                                                 Lista
                                          </button>
                                   </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                   {/* Modern Search */}
                                   <div className="md:col-span-8 lg:col-span-9 relative group">
                                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                          <input
                                                 type="text"
                                                 placeholder="Buscar por nombre o dirección..."
                                                 defaultValue={currentSearch}
                                                 onChange={(e) => handleSearch(e.target.value)}
                                                 className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] pl-14 pr-6 text-base font-bold text-foreground focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm group-hover:shadow-md"
                                          />
                                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                                                 {filteredClients.length} Resultados
                                          </div>
                                   </div>

                                   {/* Order Toggle */}
                                   <button
                                          onClick={toggleSort}
                                          className={cn(
                                                 "md:col-span-4 lg:col-span-3 h-16 rounded-[1.8rem] border-2 flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-[0.2em]",
                                                 currentSort === "debt"
                                                        ? "bg-rose-50 border-rose-100/50 text-rose-500 shadow-lg shadow-rose-500/10"
                                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                                          )}
                                   >
                                          <CreditCard className="w-4 h-4" />
                                          {currentSort === "debt" ? "Mayor Deuda" : "A–Z Alfabético"}
                                   </button>
                            </div>
                     </header>

                     {/* CONTENT AREA */}
                     <div className="relative min-h-[500px]">
                            <AnimatePresence mode="popLayout" initial={false}>
                                   {filteredClients.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0, y: 20 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, scale: 0.95 }}
                                                 className="py-32 text-center rounded-[3rem] bg-white border-2 border-dashed border-slate-100/50"
                                          >
                                                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Users className="w-10 h-10 text-slate-200" />
                                                 </div>
                                                 <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Sin Clientes</h3>
                                                 <p className="text-xs font-bold text-slate-200 mt-2 uppercase tracking-tight">Prueba cambiando los filtros de búsqueda</p>
                                          </motion.div>
                                   ) : viewMode === "grid" ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                                                 {filteredClients.map((client, idx) => (
                                                        <motion.div
                                                               key={client.id}
                                                               layout
                                                               initial={{ opacity: 0, y: 20 }}
                                                               animate={{ opacity: 1, y: 0 }}
                                                               transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5), type: "spring", bounce: 0.2 }}
                                                        >
                                                               <ClientGridCard client={client} />
                                                        </motion.div>
                                                 ))}
                                          </div>
                                   ) : (
                                          <motion.div
                                                 initial={{ opacity: 0, x: -20 }}
                                                 animate={{ opacity: 1, x: 0 }}
                                                 className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_60px_rgba(0,0,0,0.03)] overflow-hidden"
                                          >
                                                 <div className="overflow-x-auto">
                                                        <table className="w-full text-left">
                                                               <thead>
                                                                      <tr className="bg-slate-50/50 border-b border-slate-100">
                                                                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identidad</th>
                                                                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Balance USD</th>
                                                                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Logística</th>
                                                                             <th className="px-8 py-5 text-right"></th>
                                                                      </tr>
                                                               </thead>
                                                               <tbody className="divide-y divide-slate-50">
                                                                      {filteredClients.map((client) => (
                                                                             <tr key={client.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                                                                    <td className="px-8 py-6">
                                                                                           <Link href={`/clientes/${client.id}`} className="block">
                                                                                                  <div className="font-black text-base text-foreground tracking-tight group-hover:text-primary transition-colors">{client.name}</div>
                                                                                                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 uppercase tracking-tight opacity-60">
                                                                                                         <MapPin className="w-3 h-3 text-primary shrink-0" />
                                                                                                         <span className="truncate max-w-[200px]">{client.address}</span>
                                                                                                  </div>
                                                                                           </Link>
                                                                                    </td>
                                                                                    <td className="px-8 py-6">
                                                                                           <div className={cn(
                                                                                                  "text-lg font-black tracking-tight tabular-nums px-3 py-1.5 rounded-xl inline-flex",
                                                                                                  client.balance > 0 ? "text-rose-600 bg-rose-50 border border-rose-100/50" : "text-emerald-600 bg-emerald-50 border border-emerald-100/50"
                                                                                           )}>
                                                                                                  ${client.balance.toLocaleString()}
                                                                                           </div>
                                                                                    </td>
                                                                                    <td className="px-8 py-6 hidden md:table-cell">
                                                                                           <div className="flex items-center gap-2">
                                                                                                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                                                                                         <Package className="w-4 h-4" />
                                                                                                  </div>
                                                                                                  <span className="text-sm font-black text-slate-700">{client.bottlesBalance} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Botellas</span></span>
                                                                                           </div>
                                                                                    </td>
                                                                                    <td className="px-8 py-6 text-right">
                                                                                           <Link href={`/clientes/${client.id}`}>
                                                                                                  <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:shadow-lg transition-all mx-auto lg:ml-auto">
                                                                                                         <ChevronRight className="w-5 h-5" />
                                                                                                  </div>
                                                                                           </Link>
                                                                                    </td>
                                                                             </tr>
                                                                      ))}
                                                               </tbody>
                                                        </table>
                                                 </div>
                                          </motion.div>
                                   )}
                            </AnimatePresence>
                     </div>
              </div>
       );
}

function ClientGridCard({ client }: any) {
       const hasDebt = client.balance > 0;

       return (
              <Link href={`/clientes/${client.id}`} className="block h-full group">
                     <div className={cn(
                            "p-8 h-full rounded-[2.5rem] bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden relative",
                            hasDebt
                                   ? "border-rose-100/50 shadow-[0_10px_40px_rgba(244,63,94,0.04)] ring-4 ring-rose-50/30"
                                   : "border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_80px_rgba(0,0,0,0.06)] ring-4 ring-transparent hover:ring-slate-50"
                     )}>
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6">
                                   <div className="space-y-3 min-w-0 pr-4">
                                          <div className="flex items-center gap-2">
                                                 <div className={cn("w-2 h-2 rounded-full shrink-0", hasDebt ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,1)]" : "bg-emerald-400")} />
                                                 <ClientTagBadge tag={client.tag} size="sm" />
                                                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-auto">ID-{client.id}</span>
                                          </div>
                                          <h3 className="text-2xl font-black text-foreground tracking-tight leading-tight transition-colors group-hover:text-primary">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-start gap-2 text-[11px] font-bold text-slate-400 lowercase tracking-tight opacity-70">
                                                 <MapPin className="w-3.5 h-3.5 text-primary shrink-0 transition-transform group-hover:rotate-12" />
                                                 <span className="line-clamp-1">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-12 h-12 rounded-[1.2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary/25 transition-all shrink-0">
                                          <ArrowUpRight className="w-6 h-6 stroke-[2.5px]" />
                                   </div>
                            </div>

                            {/* Card Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                   <div className={cn(
                                          "p-6 rounded-[1.8rem] border flex flex-col items-center justify-center gap-2 transition-all duration-300 text-center",
                                          hasDebt
                                                 ? "bg-rose-50/50 border-rose-100 text-rose-600 shadow-inner"
                                                 : "bg-slate-50 border-slate-100 text-slate-800 shadow-inner"
                                   )}>
                                          <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40">Saldo Pendiente</span>
                                          <div className="text-xl font-black tracking-tighter tabular-nums">${client.balance.toLocaleString()}</div>
                                   </div>
                                   <div className="p-6 rounded-[1.8rem] border border-slate-100 bg-white text-slate-800 flex flex-col items-center justify-center gap-2 shadow-sm group-hover:shadow-md transition-all">
                                          <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-30">Balance Stock</span>
                                          <div className="text-xl font-black tracking-tighter tabular-nums text-primary">{client.bottlesBalance} <span className="text-[10px] opacity-40 ml-0.5">un</span></div>
                                   </div>
                            </div>
                     </div>
              </Link>
       );
}
