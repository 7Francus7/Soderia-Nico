import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

interface RouteHeaderProps {
       deliveredCount: number;
       totalStops: number;
       progress: number;
}

export function RouteHeader({ deliveredCount, totalStops, progress }: RouteHeaderProps) {
       return (
              <header className="px-1 pt-2 pb-8 space-y-6">
                     <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                   <Navigation className="w-3.5 h-3.5 fill-current" />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logística de Hoy</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground leading-tight px-1 uppercase">Ruta Activa</h1>
                     </div>

                     <div className="space-y-3 px-1">
                            <div className="flex justify-between items-end">
                                   <div className="flex items-baseline gap-2">
                                          <span className="text-3xl font-black text-foreground">{deliveredCount}</span>
                                          <span className="text-sm font-black text-muted-foreground/30 uppercase tracking-widest">/ {totalStops} Paradas</span>
                                   </div>
                                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                                          {Math.round(progress)}% Completado
                                   </span>
                            </div>
                            <div className="h-3.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                                   <motion.div
                                          className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(37,123,244,0.4)]"
                                          animate={{ width: `${progress}%` }}
                                          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                                   />
                            </div>
                     </div>
              </header>
       );
}
