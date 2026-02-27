"use strict";
"use client";

import { useState } from "react";
import { Plus, X, Box, Tag, DollarSign, Droplets, FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewProductButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              name: "",
              code: "",
              price: 0,
              isReturnable: false
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.name || !formData.code || formData.price <= 0) {
                     toast.error("Todos los campos con * son obligatorios");
                     return;
              }

              setLoading(true);
              const result = await createProduct(formData);
              if (result.success) {
                     toast.success("Producto creado exitosamente");
                     setIsOpen(false);
                     setFormData({ name: "", code: "", price: 0, isReturnable: false });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto px-8 h-14 rounded-2xl shadow-2xl">
                            <Plus className="w-5 h-5 mr-3" />
                            NUEVO PRODUCTO
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <Box className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black tracking-tight uppercase italic">Alta de Producto</h3>
                                                               <p className="text-sm text-muted-foreground font-medium italic opacity-60">Configuración de catálogo.</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                                 <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Nombre del Producto *</label>
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.name}
                                                                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                             className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                             placeholder="Ej: Sifón 1.5L"
                                                                      />
                                                               </div>
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Código Interno *</label>
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.code}
                                                                             onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                                             className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20 uppercase"
                                                                             placeholder="Ej: SIF15"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Precio de Venta ($) *</label>
                                                               <div className="relative group">
                                                                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-20" />
                                                                      <input
                                                                             type="number"
                                                                             required
                                                                             value={formData.price || ''}
                                                                             onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                                             className="w-full h-20 bg-muted/10 border border-white/5 rounded-2xl pl-12 pr-5 text-4xl font-black tracking-tighter focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                                             placeholder="0"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Tipo de Envase</label>
                                                               <div className="flex p-1 bg-muted/10 rounded-2xl border border-white/5">
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, isReturnable: true })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase transition-all",
                                                                                    formData.isReturnable ? "bg-amber-500 text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                                                                             )}
                                                                      >
                                                                             <Droplets className="w-4 h-4" /> Retornable
                                                                      </button>
                                                                      <button
                                                                             type="button"
                                                                             onClick={() => setFormData({ ...formData, isReturnable: false })}
                                                                             className={cn(
                                                                                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase transition-all",
                                                                                    !formData.isReturnable ? "bg-blue-500 text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                                                                             )}
                                                                      >
                                                                             <FlaskConical className="w-4 h-4" /> Descartable
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-4 pt-4 border-t border-white/5">
                                                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] h-16 rounded-2xl shadow-xl font-black text-sm uppercase tracking-widest">
                                                               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "REGISTRAR PRODUCTO"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </>
       );
}
