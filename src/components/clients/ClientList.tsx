"use strict";
"use client";

import { useState, useMemo } from "react";
import {
       Search,
       MapPin,
       ChevronRight,
       LayoutGrid,
       List,
       ArrowRight,
       Package,
       Users,
       CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ClientTagBadge } from "@/components/clients/ClientTagSelector";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
              <div className="space-y-8">
                     {/* Toolbar */}
                     <header className="flex flex-col gap-6 p-1">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                   <div className="flex bg-secondary p-1 rounded-xl border border-border/50 shadow-inner w-full sm:w-auto">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn(
                                                        "flex-1 sm:flex-none px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-[11px] font-bold uppercase tracking-wider",
                                                        viewMode === "grid" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                                                 )}
                                          >
                                                 <LayoutGrid className="w-4 h-4" />
                                                 Mosaico
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn(
                                                        "flex-1 sm:flex-none px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-[11px] font-bold uppercase tracking-wider",
                                                        viewMode === "table" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                                                 )}
                                          >
                                                 <List className="w-4 h-4" />
                                                 Lista
                                          </button>
                                   </div>

                                   <div className="flex items-center gap-2 w-full sm:w-auto">
                                          <button
                                                 onClick={toggleSort}
                                                 className={cn(
                                                        "flex-1 sm:flex-none h-11 px-6 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                                                        currentSort === "debt"
                                                               ? "bg-danger/5 border-danger/20 text-danger shadow-sm"
                                                               : "bg-white border-border text-muted-foreground hover:bg-secondary"
                                                 )}
                                          >
                                                 <CreditCard className="w-4 h-4" />
                                                 {currentSort === "debt" ? "Deuda Crítica" : "Orden Alfabético"}
                                          </button>
                                   </div>
                            </div>

                            <div className="relative group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                   <input
                                          type="text"
                                          placeholder="Buscar clientes por nombre, dirección o identificación..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full h-14 bg-white border border-border rounded-xl pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                                   />
                                   <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
                                          <Badge variant="secondary" className="bg-secondary/50">{filteredClients.length} ENCONTRADOS</Badge>
                                   </div>
                            </div>
                     </header>

                     {/* Main Content */}
                     <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                   {filteredClients.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 className="py-20 text-center rounded-2xl border-2 border-dashed border-border/50 bg-secondary/10"
                                          >
                                                 <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sin coincidencias</p>
                                          </motion.div>
                                   ) : viewMode === "grid" ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                                 {filteredClients.map((client, idx) => (
                                                        <motion.div
                                                               key={client.id}
                                                               initial={{ opacity: 0, y: 10 }}
                                                               animate={{ opacity: 1, y: 0 }}
                                                               transition={{ delay: idx * 0.05 }}
                                                        >
                                                               <ClientGridCard client={client} />
                                                        </motion.div>
                                                 ))}
                                          </div>
                                   ) : (
                                          <Card className="overflow-hidden">
                                                 <Table>
                                                        <TableHeader>
                                                               <TableRow>
                                                                      <TableHead>Identidad del Cliente</TableHead>
                                                                      <TableHead>Estado Financiero</TableHead>
                                                                      <TableHead className="hidden md:table-cell">Logística</TableHead>
                                                                      <TableHead className="text-right">Acciones</TableHead>
                                                               </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                               {filteredClients.map((client) => (
                                                                      <TableRow key={client.id} className="group cursor-pointer" onClick={() => router.push(`/clientes/${client.id}`)}>
                                                                             <TableCell>
                                                                                    <div className="flex flex-col">
                                                                                           <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{client.name}</span>
                                                                                           <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                                                  <MapPin className="w-3 h-3" /> {client.address}
                                                                                           </span>
                                                                                    </div>
                                                                             </TableCell>
                                                                             <TableCell>
                                                                                    <Badge variant={client.balance > 0 ? "destructive" : "success"} className="rounded-lg">
                                                                                           ${client.balance.toLocaleString()}
                                                                                    </Badge>
                                                                             </TableCell>
                                                                             <TableCell className="hidden md:table-cell">
                                                                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                                                           <Package className="w-3.5 h-3.5" />
                                                                                           {client.bottlesBalance} envases
                                                                                    </div>
                                                                             </TableCell>
                                                                             <TableCell className="text-right">
                                                                                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                                                                           <ChevronRight className="w-4 h-4" />
                                                                                    </Button>
                                                                             </TableCell>
                                                                      </TableRow>
                                                               ))}
                                                        </TableBody>
                                                 </Table>
                                          </Card>
                                   )}
                            </AnimatePresence>
                     </div>
              </div>
       );
}

function ClientGridCard({ client }: any) {
       const router = useRouter();
       const hasDebt = client.balance > 0;

       return (
              <Card
                     onClick={() => router.push(`/clientes/${client.id}`)}
                     className={cn(
                            "cursor-pointer group flex flex-col justify-between p-6 h-full transition-all duration-300 hover:shadow-lg border border-border/60",
                            hasDebt && "border-danger/10 shadow-danger/5"
                     )}
              >
                     <div>
                            <div className="flex justify-between items-start mb-4">
                                   <ClientTagBadge tag={client.tag} size="sm" />
                                   <div className={cn("w-2 h-2 rounded-full", hasDebt ? "bg-danger shadow-[0_0_8px_rgba(217,48,37,0.5)]" : "bg-success")} />
                            </div>
                            <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                                   {client.name}
                            </h3>
                            <div className="flex items-start gap-1.5 text-xs font-medium text-muted-foreground mb-6">
                                   <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary/40" />
                                   <span className="line-clamp-2">{client.address}</span>
                            </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className={cn("p-4 rounded-xl border flex flex-col gap-1", hasDebt ? "bg-danger/5 border-danger/10 text-danger" : "bg-secondary/50 border-border/50 text-foreground")}>
                                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Cobranza</span>
                                   <span className="text-lg font-black tracking-tighter">${client.balance.toLocaleString()}</span>
                            </div>
                            <div className="p-4 rounded-xl border border-border/50 bg-white shadow-sm flex flex-col gap-1">
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stock Env.</span>
                                   <span className="text-lg font-black tracking-tighter text-primary">{client.bottlesBalance}</span>
                            </div>
                     </div>
              </Card>
       );
}
