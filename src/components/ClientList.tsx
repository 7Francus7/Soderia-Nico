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
       CheckSquare,
       Square,
       MoreHorizontal,
       Share2,
       Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Professional View Pattern from Antigravity Manager
type ViewMode = "grid" | "table";

export default function ClientList({ initialClients }: { initialClients: any[] }) {
       const router = useRouter();
       const searchParams = useSearchParams();
       const [viewMode, setViewMode] = useState<ViewMode>("grid");
       const [selectedIds, setSelectedIds] = useState<number[]>([]);

       const currentSearch = searchParams.get("q") || "";
       const currentSort = searchParams.get("sort") || "name";

       // Filtering logic (useMemo for performance)
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
              router.push(`/clientes?${params.toString()}`);
       };

       const toggleSort = () => {
              const params = new URLSearchParams(searchParams);
              if (params.get("sort") === "debt") params.delete("sort");
              else params.set("sort", "debt");
              router.push(`/clientes?${params.toString()}`);
       };

       const toggleSelection = (id: number) => {
              setSelectedIds(prev =>
                     prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
              );
       };

       const selectAll = () => {
              if (selectedIds.length === filteredClients.length) setSelectedIds([]);
              else setSelectedIds(filteredClients.map(c => c.id));
       };

       return (
              <div className="space-y-8 animate-fade-in-up">
                     {/* Advanced Toolbar */}
                     <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1">
                                   <div className="relative flex-1 group">
                                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                          <input
                                                 type="text"
                                                 placeholder="Buscar clientes por nombre, dirección o teléfono..."
                                                 defaultValue={currentSearch}
                                                 onChange={(e) => handleSearch(e.target.value)}
                                                 className="w-full bg-slate-950/50 border border-white/10 rounded-2xl h-14 pl-14 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                          />
                                   </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                   <div className="bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 flex items-center gap-1">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn("p-2.5 rounded-xl transition-all", viewMode === "grid" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white")}
                                          >
                                                 <LayoutGrid className="w-5 h-5" />
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn("p-2.5 rounded-xl transition-all", viewMode === "table" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white")}
                                          >
                                                 <List className="w-5 h-5" />
                                          </button>
                                   </div>

                                   <Button
                                          variant="outline"
                                          onClick={toggleSort}
                                          className={cn(
                                                 "h-14 px-6 rounded-2xl border-white/10 font-black tracking-widest uppercase text-[10px] transition-all",
                                                 currentSort === "debt" ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "glass-card"
                                          )}
                                   >
                                          <Filter className="w-4 h-4 mr-2" />
                                          {currentSort === "debt" ? "Mayor Deuda" : "Orden ABC"}
                                   </Button>
                            </div>
                     </div>

                     {/* Bulk Actions Bar */}
                     <AnimatePresence>
                            {selectedIds.length > 0 && (
                                   <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 20 }}
                                          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[110] bg-primary px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(var(--primary),0.3)] flex items-center gap-8 border border-white/20"
                                   >
                                          <span className="text-sm font-black text-white uppercase tracking-widest italic">
                                                 {selectedIds.length} Seleccionados
                                          </span>
                                          <div className="h-6 w-px bg-white/20" />
                                          <div className="flex items-center gap-4">
                                                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-white hover:scale-110 transition-transform">
                                                        <Share2 className="w-4 h-4" /> Enviar Resumen
                                                 </button>
                                                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-white/70 hover:text-white hover:scale-110 transition-transform">
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                 </button>
                                          </div>
                                          <button onClick={() => setSelectedIds([])} className="ml-4 hover:rotate-90 transition-transform">
                                                 <Square className="w-5 h-5 text-white/50" />
                                          </button>
                                   </motion.div>
                            )}
                     </AnimatePresence>

                     {/* Grid View */}
                     {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                   {filteredClients.length === 0 ? (
                                          <div className="col-span-full py-40 text-center glass-card border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center opacity-30 italic">
                                                 <Users className="w-20 h-20 mb-4" />
                                                 <p className="text-2xl font-black uppercase tracking-tighter">No se encontraron clientes</p>
                                          </div>
                                   ) : (
                                          filteredClients.map((client, idx) => (
                                                 <ClientGridCard
                                                        key={client.id}
                                                        client={client}
                                                        delay={idx * 0.05}
                                                        isSelected={selectedIds.includes(client.id)}
                                                        onToggleSelect={() => toggleSelection(client.id)}
                                                 />
                                          ))
                                   )}
                            </div>
                     ) : (
                            /* Table View - Pattern from Antigravity Manager Accounts.tsx */
                            <div className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-white/5 border-b border-white/5">
                                                        <th className="p-6 w-16">
                                                               <button onClick={selectAll} className="text-white/20 hover:text-primary transition-colors">
                                                                      {selectedIds.length === filteredClients.length && filteredClients.length > 0 ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                                                               </button>
                                                        </th>
                                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Cliente / Dirección</th>
                                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Saldo Actual</th>
                                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Envases</th>
                                                        <th className="p-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Acciones</th>
                                                 </tr>
                                          </thead>
                                          <tbody>
                                                 {filteredClients.map((client) => (
                                                        <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                               <td className="p-6">
                                                                      <button onClick={() => toggleSelection(client.id)} className={cn("transition-colors", selectedIds.includes(client.id) ? "text-primary" : "text-white/10 group-hover:text-white/30")}>
                                                                             {selectedIds.includes(client.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                                                      </button>
                                                               </td>
                                                               <td className="p-6">
                                                                      <Link href={`/clientes/${client.id}`} className="block">
                                                                             <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors italic uppercase">{client.name}</div>
                                                                             <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-1">
                                                                                    <MapPin className="w-3 h-3" /> {client.address}
                                                                             </div>
                                                                      </Link>
                                                               </td>
                                                               <td className="p-6">
                                                                      <div className={cn("text-xl font-black tracking-tight", client.balance > 0 ? "text-rose-500" : "text-emerald-500")}>
                                                                             ${client.balance.toLocaleString()}
                                                                      </div>
                                                               </td>
                                                               <td className="p-6">
                                                                      <div className="text-lg font-black text-slate-400">
                                                                             {client.bottlesBalance} <span className="text-[10px] uppercase opacity-30">unid</span>
                                                                      </div>
                                                               </td>
                                                               <td className="p-6 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-all">
                                                                                    <Edit className="w-4 h-4" />
                                                                             </Button>
                                                                             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-500 transition-all">
                                                                                    <MessageCircle className="w-4 h-4" />
                                                                             </Button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     )}
              </div>
       );
}

function ClientGridCard({ client, delay, isSelected, onToggleSelect }: any) {
       const hasDebt = client.balance > 0;

       return (
              <Card className={cn(
                     "group relative overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-fade-in-up glass-card rounded-[3rem] border-white/5",
                     isSelected && "border-primary/50 ring-2 ring-primary/20",
                     !isSelected && "hover:border-white/20"
              )} style={{ animationDelay: `${delay}s` }}>

                     {/* Selection Checkbox Overlay */}
                     <button
                            onClick={(e) => { e.preventDefault(); onToggleSelect(); }}
                            className={cn(
                                   "absolute top-8 left-8 z-20 w-8 h-8 rounded-xl border flex items-center justify-center transition-all",
                                   isSelected ? "bg-primary border-primary text-white scale-110" : "bg-black/20 border-white/10 text-white/0 hover:border-white/30"
                            )}
                     >
                            <CheckSquare className="w-5 h-5" />
                     </button>

                     <Link href={`/clientes/${client.id}`} className="block p-10">
                            <div className="flex justify-between items-start mb-10 pl-10">
                                   <div className="space-y-3 flex-1 overflow-hidden">
                                          <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Ficha OS.v2</span>
                                          </div>
                                          <h3 className="text-3xl font-black tracking-tightest group-hover:text-primary transition-colors truncate italic italic uppercase">
                                                 {client.name}
                                          </h3>
                                          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5">
                                                 <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                                                 <span className="truncate">{client.address}</span>
                                          </div>
                                   </div>
                                   <div className="w-14 h-14 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shrink-0 shadow-2xl relative overflow-hidden">
                                          <ChevronRight className="w-7 h-7 relative z-10" />
                                          <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                   </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                   <div className={cn(
                                          "p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group/item",
                                          hasDebt ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-xl shadow-rose-500/10" : "bg-white/5 border-white/5 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
                                   )}>
                                          <CreditCard className="w-5 h-5 mb-3 opacity-50" />
                                          <div className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Deuda Saldo</div>
                                          <div className="text-3xl font-black tracking-tighter">${client.balance.toLocaleString()}</div>
                                   </div>
                                   <div className={cn(
                                          "p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden",
                                          client.bottlesBalance > 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-xl shadow-amber-500/10" : "bg-white/5 border-white/5 grayscale opacity-40"
                                   )}>
                                          <Droplets className="w-5 h-5 mb-3 opacity-50" />
                                          <div className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Envases</div>
                                          <div className="text-3xl font-black tracking-tighter">{client.bottlesBalance}</div>
                                   </div>
                            </div>
                     </Link>
              </Card>
       );
}
