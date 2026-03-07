"use strict";
"use client";

import { useState } from "react";
import { Search, Package, Tag, Edit, Trash2, Droplets, FlaskConical, DollarSign, Activity, Settings2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductList({ initialProducts }: { initialProducts: any[] }) {
       const [search, setSearch] = useState("");

       const filtered = initialProducts.filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.code.toLowerCase().includes(search.toLowerCase())
       );

       const handleDelete = async (id: number) => {
              if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
              const result = await deleteProduct(id);
              if (result.success) toast.success("¡Producto eliminado!", {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
              else toast.error("Error: " + result.error, {
                     style: { borderRadius: '1rem', fontWeight: '800' }
              });
       };

       return (
              <div className="space-y-10">
                     {/* iOS Style Search Bar */}
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative group flex-1 w-full">
                                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 stroke-[3px] transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar por nombre o código..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-18 bg-slate-50 border-2 border-slate-50 rounded-[2rem] pl-16 pr-8 text-base font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
                                   />
                            </div>
                            <div className="h-18 px-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center shrink-0 min-w-[120px] shadow-sm">
                                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Productos</span>
                            </div>
                     </div>

                     {/* Grid with staggered motion */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                   {filtered.length === 0 ? (
                                          <motion.div
                                                 initial={{ opacity: 0, scale: 0.9 }}
                                                 animate={{ opacity: 1, scale: 1 }}
                                                 className="col-span-full py-24 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem] px-10"
                                          >
                                                 <Package className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                                                 <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-[11px]">No se encontraron resultados</p>
                                          </motion.div>
                                   ) : (
                                          filtered.map((product, idx) => (
                                                 <motion.div
                                                        layout
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05, type: "spring", damping: 20 }}
                                                 >
                                                        <Card className="group overflow-hidden rounded-[2.8rem] border-2 border-slate-50 bg-white hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full relative cursor-default">
                                                               <div className="p-8 pb-10 flex-1 space-y-8">
                                                                      {/* Top Header Card */}
                                                                      <div className="flex justify-between items-start">
                                                                             <div className="space-y-1">
                                                                                    <div className="flex items-center gap-1.5 opacity-30 mb-0.5 px-0.5">
                                                                                           <Tag className="w-3 h-3" />
                                                                                           <span className="text-[9px] font-black uppercase tracking-[0.1em]">{product.code}</span>
                                                                                    </div>
                                                                                    <h3 className="text-2xl font-black text-foreground leading-tight tracking-tighter group-hover:text-primary transition-colors pr-2">
                                                                                           {product.name}
                                                                                    </h3>
                                                                             </div>
                                                                             <div className={cn(
                                                                                    "w-12 h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 shadow-sm",
                                                                                    product.isReturnable ? "bg-amber-50 border-amber-100/50 text-amber-500 shadow-amber-500/5" : "bg-indigo-50 border-indigo-100/50 text-indigo-500 shadow-indigo-500/5"
                                                                             )}>
                                                                                    {product.isReturnable ? <Droplets className="w-6 h-6 stroke-[2.5px]" /> : <FlaskConical className="w-6 h-6 stroke-[2.5px]" />}
                                                                             </div>
                                                                      </div>

                                                                      {/* Price Feature Area */}
                                                                      <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-[1.8rem] relative group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/40 transition-all duration-500">
                                                                             <div className="flex items-center gap-2 mb-2 px-1">
                                                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Precio de Venta</h4>
                                                                             </div>
                                                                             <div className="flex items-baseline text-4xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                                                                                    <span className="text-base font-black text-primary mr-1 opacity-40">$</span>
                                                                                    {product.price.toLocaleString()}
                                                                             </div>
                                                                      </div>

                                                                      {/* Status Pills */}
                                                                      <div className="flex flex-wrap gap-2 pt-2">
                                                                             <span className={cn(
                                                                                    "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm",
                                                                                    product.isReturnable ? "text-amber-500 bg-amber-50 border-amber-100" : "text-indigo-500 bg-indigo-50 border-indigo-100"
                                                                             )}>
                                                                                    {product.isReturnable ? "RETORNABLE" : "DESCARTABLE"}
                                                                             </span>
                                                                             {product.isReturnable && (
                                                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-100 bg-slate-50 text-slate-300 shadow-sm">
                                                                                           CON ENVASE
                                                                                    </span>
                                                                             )}
                                                                      </div>
                                                               </div>

                                                               {/* Action Bar for Card */}
                                                               <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-2">
                                                                      <button className="h-14 flex-1 rounded-[1.4rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all active:scale-95 group/btn shadow-sm">
                                                                             <Edit className="w-5 h-5 stroke-[2.5px] group-hover/btn:rotate-12 transition-transform" />
                                                                      </button>
                                                                      <button
                                                                             onClick={() => handleDelete(product.id)}
                                                                             className="h-14 flex-1 rounded-[1.4rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 group/btn shadow-sm"
                                                                      >
                                                                             <Trash className="w-5 h-5 stroke-[2.5px] group-hover/btn:rotate-12 transition-transform" />
                                                                      </button>
                                                               </div>
                                                        </Card>
                                                 </motion.div>
                                          ))
                                   )}
                            </AnimatePresence>
                     </div>
              </div>
       );
}
