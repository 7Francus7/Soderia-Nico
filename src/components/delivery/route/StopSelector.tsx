import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DeliveryStop } from "@/types/delivery";

interface StopSelectorProps {
       stops: DeliveryStop[];
       currentIdx: number;
       onSelect: (index: number) => void;
}

export function StopSelector({ stops, currentIdx, onSelect }: StopSelectorProps) {
       return (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-10 px-1 snap-x scroll-smooth">
                     {stops.map((stop, i) => {
                            const isActive = i === currentIdx;
                            const isCompleted = stop.status === "delivered";
                            const isAbsent = stop.status === "absent";

                            return (
                                   <motion.button
                                          key={`${stop.orderId}-${i}`}
                                          onClick={() => onSelect(i)}
                                          whileTap={{ scale: 0.9 }}
                                          className={cn(
                                                 "shrink-0 w-16 h-16 rounded-[1.5rem] border-2 flex flex-col items-center justify-center transition-all snap-center relative shadow-lg",
                                                 isActive
                                                        ? "bg-primary border-primary text-white shadow-primary/25 scale-110 z-10"
                                                        : "bg-white border-transparent text-slate-300 shadow-slate-200/40",
                                                 !isActive && isCompleted && "bg-emerald-50 text-emerald-500 shadow-emerald-500/10 scale-95 opacity-80",
                                                 !isActive && isAbsent && "bg-rose-50 text-rose-500 shadow-rose-500/10 scale-95 opacity-80"
                                          )}
                                   >
                                          <span className={cn("text-lg font-black tracking-tighter", isActive ? "text-white" : "text-foreground")}>{i + 1}</span>
                                          {isActive && (
                                                 <motion.div
                                                        layoutId="active-indicator-route"
                                                        className="absolute -bottom-3 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,123,244,1)]"
                                                 />
                                          )}
                                   </motion.button>
                            );
                     })}
              </div>
       );
}
