"use strict";
"use client";

import { useState } from "react";
import { Plus, X, Box, DollarSign, PackageCheck, Loader2, Save, ArrowRight, Hash } from "lucide-react";
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
                     toast.error("Nombre, código y precio son obligatorios");
                     return;
              }

              setLoading(true);
              const result = await createProduct(formData);
              if (result.success) {
                     toast.success("¡Producto creado!");
                     setIsOpen(false);
                     setFormData({ name: "", code: "", price: 0, isReturnable: true });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            variant="premium"
                            size="lg"
                            className="shadow-2xl group"
                     >
                            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-all duration-500" />
                            NUEVO PRODUCTO
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 text-white overflow-hidden">
                                          {/* Backdrop with extreme blur */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                                          />

                                          <motion.div
                                                 initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                                 animate={{ y: 0, opacity: 1, scale: 1 }}
                                                 exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                                 className="relative w-full max-w-lg bg-neutral-950/40 sm:rounded-[4rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
                                          >
                                                 <div className="p-10 pb-6 flex justify-between items-center relative z-10">
                                                        <div className="flex items-center gap-6">
                                                               <div className="w-16 h-16 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-white/20">
                                                                      <Box className="w-8 h-8" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Catálogo</h3>
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-3">Nuevo Item de Venta</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5">
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                                                        <div className="space-y-6">
                                                               <div className="space-y-4">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Descripción del Producto</label>
                                                                      <div className="relative group">
                                                                             <Box className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    autoFocus
                                                                                    value={formData.name}
                                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                    placeholder="Ej: Sifón 1.5L pack x6"
                                                                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               <div className="grid grid-cols-2 gap-6">
                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Código / SKU</label>
                                                                             <div className="relative group">
                                                                                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
                                                                                    <input
                                                                                           type="text"
                                                                                           required
                                                                                           value={formData.code}
                                                                                           onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                                                           placeholder="SKU"
                                                                                           className="w-full h-16 bg-white/5 border border-white/10 rounded-[1.5rem] pl-14 pr-6 font-bold text-lg text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10"
                                                                                    />
                                                                             </div>
                                                                      </div>

                                                                      <div className="space-y-4">
                                                                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Precio</label>
                                                                             <div className="relative group">
                                                                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
                                                                                    <input
                                                                                           type="number"
                                                                                           required
                                                                                           value={formData.price || ''}
                                                                                           onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                                                           placeholder="0.00"
                                                                                           className="w-full h-16 bg-white/5 border border-white/10 rounded-[1.5rem] pl-14 pr-6 font-bold text-lg text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10 tabular-nums"
                                                                                    />
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-4">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-6">Configuración</label>
                                                                      <div className="flex p-2 bg-black/60 rounded-[2rem] border border-white/10">
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setFormData({ ...formData, isReturnable: true })}
                                                                                    className={cn(
                                                                                           "flex-1 flex items-center justify-center gap-3 py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                           formData.isReturnable ? "bg-white text-black shadow-xl" : "text-white/30 hover:bg-white/5"
                                                                                    )}
                                                                             >
                                                                                    <PackageCheck className="w-4 h-4" /> Es Retornable
                                                                             </button>
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setFormData({ ...formData, isReturnable: false })}
                                                                                    className={cn(
                                                                                           "flex-1 flex items-center justify-center gap-3 py-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all",
                                                                                           !formData.isReturnable ? "bg-white text-black shadow-xl" : "text-white/30 hover:bg-white/5"
                                                                                    )}
                                                                             >
                                                                                    <Plus className="w-4 h-4" /> Descartable
                                                                             </button>
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-6 pt-4">
                                                               <Button
                                                                      type="button"
                                                                      variant="ghost"
                                                                      className="flex-1 h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 text-white/30 hover:text-white"
                                                                      onClick={() => setIsOpen(false)}
                                                               >
                                                                      Cancelar
                                                               </Button>
                                                               <Button
                                                                      type="submit"
                                                                      disabled={loading}
                                                                      variant="action"
                                                                      size="xl"
                                                                      className="flex-[2] shadow-2xl shadow-primary/40 group active:scale-95"
                                                               >
                                                                      {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                                                                             <span className="flex items-center gap-3">
                                                                                    CREAR PRODUCTO
                                                                                    <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                                                                             </span>
                                                                      )}
                                                               </Button>
                                                        </div>
                                                 </form>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
