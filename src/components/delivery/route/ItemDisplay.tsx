import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemDisplayProps {
       items: { name: string; qty: number }[];
       showItems: boolean;
       onToggle: () => void;
}

export function ItemDisplay({ items, showItems, onToggle }: ItemDisplayProps) {
       return (
              <div className="pt-4 border-t border-slate-50">
                     <button
                            onClick={onToggle}
                            className="w-full h-16 flex items-center justify-between px-6 bg-slate-50/50 rounded-[1.8rem] border border-slate-100/50 group active:scale-[0.98] transition-all"
                     >
                            <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                          <Package className="w-5 h-5" />
                                   </div>
                                   <span className="text-sm font-black text-foreground tracking-tight uppercase">Productos en Pedido</span>
                            </div>
                            <div className={cn("w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 transition-transform shadow-sm", showItems && "rotate-90")}>
                                   <ChevronRight className="w-4 h-4" />
                            </div>
                     </button>

                     <AnimatePresence>
                            {showItems && (
                                   <motion.div
                                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                          className="overflow-hidden"
                                   >
                                          <div className="grid grid-cols-1 gap-3 pt-6">
                                                 {items.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between px-6 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                                                               <span className="text-sm font-black text-slate-700 tracking-tight uppercase group-hover:text-primary transition-colors">{item.name}</span>
                                                               <div className="px-3 py-1.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
                                                                      <span className="text-sm font-black text-white">{item.qty} un.</span>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </motion.div>
                            )}
                     </AnimatePresence>
              </div>
       );
}
