"use strict";
"use client";

import { useState, useMemo } from "react";
import {
       Search,
       Filter,
       Phone,
       MapPin,
       ChevronRight,
       CreditCard,
       Droplets,
       Trash2,
       Edit,
       MessageCircle,
       LayoutGrid,
       List,
       Users,
       ArrowRight,
       ArrowUpRight,
       DollarSign,
       Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
              <div className="space-y-12">
                     {/* TOOLBAR COMMANDS */}
                     <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="relative w-full md:max-w-2xl group">
                                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Filtrar por nombre, calle o zona..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full h-20 bg-neutral-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/10"
                                   />
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                                   <div className="flex bg-black/40 p-2 rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-md shrink-0">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn(
                                                        "p-4 rounded-xl transition-all duration-300",
                                                        viewMode === "grid" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white/60"
                                                 )}
                                          >
                                                 <LayoutGrid className="w-5 h-5" />
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn(
                                                        "p-4 rounded-xl transition-all duration-300",
                                                        viewMode === "table" ? "bg-white text-black shadow-xl" : "text-white/30 hover:text-white/60"
                                                 )}
                                          >
                                                 <List className="w-5 h-5" />
                                          </button>
                                   </div>

                                   <button
                                          onClick={toggleSort}
                                          className={cn(
                                                 "h-16 px-8 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap shadow-2xl",
                                                 currentSort === "debt"
                                                        ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                          )}
                                   >
                                          {currentSort === "debt" ? "MOSTRANDO DEUDORES" : "ORDEN ALFABÉTICO"}
                                   </button>
                            </div>
                     </div>

                     {/* CONTENT PIPELINE */}
                     <AnimatePresence mode="popLayout">
                            {viewMode === "grid" ? (
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                          {filteredClients.map((client, idx) => (
                                                 <motion.div
                                                        key={client.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                                                 >
                                                        <ClientGridCard client={client} />
                                                 </motion.div>
                                          ))}
                                   </div>
                            ) : (
                                   <div className="border border-white/5 rounded-[3rem] overflow-hidden bg-neutral-950/40 backdrop-blur-3xl shadow-3xl">
                                          <table className="w-full text-left">
                                                 <thead className="bg-white/5">
                                                        <tr>
                                                               <th className="p-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Identificación Cliente</th>
                                                               <th className="p-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Balance</th>
                                                               <th className="p-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Logística Envases</th>
                                                               <th className="p-8 text-right"></th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-white/5">
                                                        {filteredClients.map((client) => (
                                                               <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                                                                      <td className="p-8">
                                                                             <Link href={`/clientes/${client.id}`} className="block">
                                                                                    <div className="font-black text-2xl text-white italic group-hover:translate-x-3 transition-transform duration-500">{client.name}</div>
                                                                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 flex items-center gap-2 mt-2">
                                                                                           <MapPin className="w-3 h-3 text-white/40" /> {client.address}
                                                                                    </div>
                                                                             </Link>
                                                                      </td>
                                                                      <td className="p-8">
                                                                             <div className={cn(
                                                                                    "text-3xl font-black tracking-tighter tabular-nums",
                                                                                    client.balance > 0 ? "text-rose-500" : "text-emerald-500"
                                                                             )}>
                                                                                    ${client.balance.toLocaleString()}
                                                                             </div>
                                                                      </td>
                                                                      <td className="p-8">
                                                                             <div className="text-2xl font-black text-white/40 tracking-tighter">
                                                                                    {client.bottlesBalance} <span className="text-[10px] uppercase tracking-widest opacity-30">unid</span>
                                                                             </div>
                                                                      </td>
                                                                      <td className="p-8 text-right">
                                                                             <Link href={`/clientes/${client.id}`}>
                                                                                    <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full border border-white/5 hover:bg-white hover:text-black transition-all">
                                                                                           <ChevronRight className="w-6 h-6" />
                                                                                    </Button>
                                                                             </Link>
                                                                      </td>
                                                               </tr>
                                                        ))}
                                                 </tbody>
                                          </table>
                                   </div>
                            )}
                     </AnimatePresence>
              </div>
       );
}

function ClientGridCard({ client }: any) {
       const hasDebt = client.balance > 0;

       return (
              <div className="group relative">
                     <Link href={`/clientes/${client.id}`} className="block h-full">
                            <div className={cn(
                                   "p-10 h-full rounded-[3.5rem] border bg-neutral-900/40 backdrop-blur-3xl transition-all duration-700 hover:shadow-[0_0_100px_rgba(0,0,0,0.5)] hover:border-white/10 flex flex-col justify-between group overflow-hidden relative",
                                   hasDebt ? "border-rose-500/20" : "border-white/5"
                            )}>
                                   <div className="flex justify-between items-start relative z-10 mb-12">
                                          <div className="space-y-3 min-w-0 flex-1">
                                                 <div className="flex items-center gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full", hasDebt ? "bg-rose-500" : "bg-emerald-500")} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Perfil #00{client.id}</span>
                                                 </div>
                                                 <h3 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-[1] transition-transform duration-500 group-hover:scale-105 origin-left">
                                                        {client.name}
                                                 </h3>
                                                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        <span className="truncate">{client.address}</span>
                                                 </div>
                                          </div>
                                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all shadow-2xl">
                                                 <ArrowUpRight className="w-6 h-6" />
                                          </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-6 relative z-10">
                                          <div className={cn(
                                                 "p-6 rounded-[2rem] border flex flex-col justify-between h-40 transition-all duration-500",
                                                 hasDebt ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-2xl shadow-rose-500/10" : "bg-white/5 border-white/10 text-white/60"
                                          )}>
                                                 <DollarSign className="w-5 h-5 mb-4 opacity-40 group-hover:rotate-12 transition-transform" />
                                                 <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Presupuesto</div>
                                                        <div className="text-3xl font-black tracking-tighter tabular-nums">${client.balance.toLocaleString()}</div>
                                                 </div>
                                          </div>
                                          <div className="p-6 rounded-[2rem] border border-white/10 bg-white/5 text-white/60 h-40 flex flex-col justify-between transition-all duration-500 hover:bg-white/10">
                                                 <Package className="w-5 h-5 mb-4 opacity-40 group-hover:-rotate-12 transition-transform" />
                                                 <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Stock Envases</div>
                                                        <div className="text-3xl font-black tracking-tighter tabular-nums">{client.bottlesBalance}</div>
                                                 </div>
                                          </div>
                                   </div>

                                   {/* Animated Gloss Effect */}
                                   <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />
                            </div>
                     </Link>
              </div>
       );
}
