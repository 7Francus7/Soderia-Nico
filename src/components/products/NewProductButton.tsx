"use strict";
"use client";

import { useState } from "react";
import { Plus, X, Box, DollarSign, PackageCheck, Loader2, Save, ArrowRight, Hash, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NewProductButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              name: "",
              code: "",
              price: 0,
              isReturnable: true,
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.name || !formData.code || formData.price <= 0) {
                     toast.error("Nombre, código y precio son obligatorios", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     return;
              }

              setLoading(true);
              const result = await createProduct(formData);
              if (result.success) {
                     toast.success("¡Producto creado con éxito!", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     setIsOpen(false);
                     setFormData({ name: "", code: "", price: 0, isReturnable: true });
              } else {
                     toast.error("Error: " + result.error, {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
              }
              setLoading(true);
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="h-16 bg-primary text-white shadow-2xl shadow-primary/30 rounded-[1.8rem] px-10 flex items-center gap-3 active:scale-95 transition-all text-[11px] font-black uppercase tracking-[0.2em] w-full sm:w-auto"
                     >
                            <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                            <span>Añadir Producto</span>
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          {/* Backdrop Overlay */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                                          />

                                          {/* iOS Style Modal Container */}
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full max-w-xl h-[92vh] lg:h-auto bg-white rounded-t-[3.5rem] lg:rounded-[3.5rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 {/* Swipe Handle & Header */}
                                                 <div className="flex flex-col items-center pt-3 pb-8 sticky top-0 bg-white/95 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">Ficha de Activo</h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Creación de Producto</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => setIsOpen(false)}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-6 h-6" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-32 scrollbar-hide">
                                                        <div className="space-y-10">
                                                               {/* Main Identity Section */}
                                                               <div className="space-y-4 px-1 pb-2">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                                                                             <Layers className="w-4 h-4" /> Descripción del Item
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    autoFocus
                                                                                    value={formData.name}
                                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                    placeholder='Ej: "Sifón 1.5L Pack x6", "Bidón 20L"...'
                                                                                    className="w-full h-18 bg-slate-50 border-2 border-slate-50 rounded-[2.2rem] px-8 text-lg font-black text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               {/* Code and Price Grid */}
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                      <div className="space-y-4 px-1">
                                                                             <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                                                                                    <Hash className="w-4 h-4" /> Identificador SKU
                                                                             </label>
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.code}
                                                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                                                    placeholder="Cód-Ref"
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[1.8rem] px-8 text-base font-bold text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner uppercase"
                                                                             />
                                                                      </div>

                                                                      <div className="space-y-4 px-1">
                                                                             <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                                                                                    <DollarSign className="w-4 h-4" /> Precio Minorista ($)
                                                                             </label>
                                                                             <input
                                                                                    type="number"
                                                                                    required
                                                                                    value={formData.price || ''}
                                                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                                                    placeholder="0.00"
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[1.8rem] px-8 text-base font-bold text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner tabular-nums"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               {/* Returnable Toggle Segmented Control */}
                                                               <div className="space-y-4 px-1">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 flex items-center gap-2">
                                                                             <PackageCheck className="w-4 h-4" /> Política de Envases
                                                                      </label>
                                                                      <div className="flex p-2 bg-slate-50/80 rounded-[2rem] border-2 border-slate-50 shadow-inner">
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setFormData({ ...formData, isReturnable: true })}
                                                                                    className={cn(
                                                                                           "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300",
                                                                                           formData.isReturnable ? "bg-white text-amber-500 shadow-xl shadow-amber-500/10 border border-amber-100" : "text-slate-300 hover:bg-white/50"
                                                                                    )}
                                                                             >
                                                                                    <PackageCheck className="w-5 h-5 stroke-[2.5px]" /> Retornable
                                                                             </button>
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setFormData({ ...formData, isReturnable: false })}
                                                                                    className={cn(
                                                                                           "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.15em] transition-all duration-300",
                                                                                           !formData.isReturnable ? "bg-white text-indigo-500 shadow-xl shadow-indigo-500/10 border border-indigo-100" : "text-slate-300 hover:bg-white/50"
                                                                                    )}
                                                                             >
                                                                                    <Plus className="w-5 h-5 rotate-45 stroke-[2.5px]" /> Descartable
                                                                             </button>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </form>

                                                 {/* Action Bar Sticky iOS Style */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               className="h-16 flex-1 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 active:scale-95 transition-all outline-none"
                                                               onClick={() => setIsOpen(false)}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        <Button
                                                               type="submit"
                                                               onClick={handleSubmit}
                                                               disabled={loading}
                                                               className="h-16 flex-[2] bg-primary text-white shadow-2xl shadow-primary/30 rounded-3xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3"
                                                        >
                                                               {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                                                      <>
                                                                             <Check className="w-6 h-6 stroke-[3px]" />
                                                                             Dar de Alta
                                                                      </>
                                                               )}
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
