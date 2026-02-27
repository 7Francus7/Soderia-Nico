"use client";

import { useEffect, useState } from "react";
import {
       Activity,
       Truck,
       CreditCard,
       UserPlus,
       Clock,
       ArrowUpRight,
       Search,
       ChevronRight,
       AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const mockActivities = [
       { id: 1, type: "ORDER", title: "Nuevo Pedido", detail: "Juan Perez", time: "2m", status: "PENDING" },
       { id: 2, type: "PAYMENT", title: "Cobranza", detail: "Marta Gomez - $8.500", time: "5m", status: "SUCCESS" },
       { id: 3, type: "CLIENT", title: "Nuevo Cliente", detail: "Restaurante El Gaucho", time: "15m", status: "SUCCESS" },
       { id: 4, type: "ORDER", title: "Entrega OK", detail: "Ruta Norte - Carlos", time: "20m", status: "SUCCESS" },
];

export default function LiveActivityMonitor() {
       const [activities] = useState(mockActivities);
       const [isLive, setIsLive] = useState(true);

       return (
              <Card className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-[600px] shadow-sm">
                     {/* Header */}
                     <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                          <Activity className="w-5 h-5" />
                                   </div>
                                   <div>
                                          <h3 className="font-semibold text-base leading-none mb-1">Actividad Reciente</h3>
                                          <div className="flex items-center gap-1.5">
                                                 <div className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                                                 <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                                        {isLive ? "En Vivo" : "Pausado"}
                                                 </span>
                                          </div>
                                   </div>
                            </div>

                            <button
                                   onClick={() => setIsLive(!isLive)}
                                   className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
                            >
                                   <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" />
                            </button>
                     </div>

                     {/* Activities List */}
                     <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                            <AnimatePresence initial={false}>
                                   {activities.map((activity) => (
                                          <motion.div
                                                 key={activity.id}
                                                 initial={{ opacity: 0, y: 10 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 className="group flex items-center gap-4 p-4 hover:bg-muted/50 rounded-xl border border-transparent hover:border-border transition-all cursor-pointer"
                                          >
                                                 <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border/50 bg-background",
                                                        activity.status === "SUCCESS" ? "text-emerald-600 dark:text-emerald-400" :
                                                               activity.status === "WARNING" ? "text-rose-600 dark:text-rose-400" :
                                                                      "text-primary"
                                                 )}>
                                                        {activity.type === "ORDER" && <Truck className="w-5 h-5" />}
                                                        {activity.type === "PAYMENT" && <CreditCard className="w-5 h-5" />}
                                                        {activity.type === "CLIENT" && <UserPlus className="w-5 h-5" />}
                                                        {activity.type === "DEBT" && <AlertCircle className="w-5 h-5" />}
                                                 </div>

                                                 <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                               <h4 className="font-semibold text-sm truncate">{activity.title}</h4>
                                                               <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                                                      {activity.time}
                                                               </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate font-medium">{activity.detail}</p>
                                                 </div>

                                                 <ChevronRight className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all" />
                                          </motion.div>
                                   ))}
                            </AnimatePresence>
                     </div>

                     {/* Footer */}
                     <div className="p-4 border-t border-border bg-muted/10">
                            <div className="relative">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                   <input
                                          type="text"
                                          placeholder="Filtrar eventos..."
                                          className="w-full h-9 bg-background border border-border rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                   />
                            </div>
                     </div>
              </Card>
       );
}
