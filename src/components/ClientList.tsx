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
       Users,
       MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "grid" | "table";

export default function ClientList({ initialClients }: { initialClients: any[] }) {
       const router = useRouter();
       const searchParams = useSearchParams();
       const [viewMode, setViewMode] = useState<ViewMode>("grid");
       const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
              router.push(`/clientes?${params.toString()}`);
       };

       const toggleSort = () => {
              const params = new URLSearchParams(searchParams);
              if (params.get("sort") === "debt") params.delete("sort");
              else params.set("sort", "debt");
              router.push(`/clientes?${params.toString()}`);
       };

       return (
              <div className="space-y-12">
                     {/* Toolbar */}
                     <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-8 border-b border-border">
                            <div className="relative w-full md:max-w-md group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar por nombre o dirección..."
                                          defaultValue={currentSearch}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          className="w-full bg-muted/40 border-none rounded-2xl h-11 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                   />
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                   <div className="flex bg-muted p-1 rounded-xl">
                                          <button
                                                 onClick={() => setViewMode("grid")}
                                                 className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
                                          >
                                                 <LayoutGrid className="w-4 h-4" />
                                          </button>
                                          <button
                                                 onClick={() => setViewMode("table")}
                                                 className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
                                          >
                                                 <List className="w-4 h-4" />
                                          </button>
                                   </div>

                                   <Button
                                          variant="outline"
                                          onClick={toggleSort}
                                          className={cn(
                                                 "h-11 px-5 rounded-xl border-border font-semibold text-xs transition-all",
                                                 currentSort === "debt" ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10" : ""
                                          )}
                                   >
                                          <Filter className="w-3.5 h-3.5 mr-2" />
                                          {currentSort === "debt" ? "Mayor Deuda" : "Orden ABC"}
                                   </Button>
                            </div>
                     </div>

                     {/* Content */}
                     {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {filteredClients.map((client) => (
                                          <ClientGridCard key={client.id} client={client} />
                                   ))}
                            </div>
                     ) : (
                            <div className="border border-border rounded-xl overflow-hidden bg-card">
                                   <table className="w-full text-left">
                                          <thead className="bg-muted/50">
                                                 <tr>
                                                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                                                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo</th>
                                                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Envases</th>
                                                        <th className="p-4 text-right"></th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border">
                                                 {filteredClients.map((client) => (
                                                        <tr key={client.id} className="hover:bg-muted/30 transition-colors group">
                                                               <td className="p-4">
                                                                      <Link href={`/clientes/${client.id}`}>
                                                                             <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{client.name}</div>
                                                                             <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                                    <MapPin className="w-3 h-3" /> {client.address}
                                                                             </div>
                                                                      </Link>
                                                               </td>
                                                               <td className="p-4">
                                                                      <div className={cn("font-semibold", client.balance > 0 ? "text-rose-600" : "text-emerald-600")}>
                                                                             ${client.balance.toLocaleString()}
                                                                      </div>
                                                               </td>
                                                               <td className="p-4">
                                                                      <div className="text-sm font-medium text-muted-foreground">
                                                                             {client.bottlesBalance} <span className="text-[10px] uppercase opacity-50">unid</span>
                                                                      </div>
                                                               </td>
                                                               <td className="p-4 text-right">
                                                                      <MoreVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all cursor-pointer inline-block" />
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

function ClientGridCard({ client }: any) {
       const hasDebt = client.balance > 0;

       return (
              <Card className="group relative border border-border bg-card hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                     <Link href={`/clientes/${client.id}`} className="block p-8">
                            <div className="space-y-4 mb-8">
                                   <div className="flex justify-between items-start capitalize">
                                          <div className="space-y-1">
                                                 <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                        {client.name}
                                                 </h3>
                                                 <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate">{client.address}</span>
                                                 </div>
                                          </div>
                                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                 <ChevronRight className="w-5 h-5" />
                                          </div>
                                   </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                   <div className={cn(
                                          "p-4 rounded-xl border flex flex-col justify-between",
                                          hasDebt ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/5 dark:border-rose-500/10" : "bg-muted/40 border-transparent text-muted-foreground"
                                   )}>
                                          <CreditCard className="w-4 h-4 mb-2 opacity-60" />
                                          <div>
                                                 <div className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Saldo</div>
                                                 <div className="text-xl font-semibold">${client.balance.toLocaleString()}</div>
                                          </div>
                                   </div>
                                   <div className="p-4 rounded-xl border border-transparent bg-muted/40 text-muted-foreground">
                                          <Droplets className="w-4 h-4 mb-2 opacity-60" />
                                          <div>
                                                 <div className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Envases</div>
                                                 <div className="text-xl font-semibold">{client.bottlesBalance}</div>
                                          </div>
                                   </div>
                            </div>
                     </Link>
              </Card>
       );
}
