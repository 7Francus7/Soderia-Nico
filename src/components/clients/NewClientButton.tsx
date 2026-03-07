"use strict";
"use client";

import { useState } from "react";
import { Plus, X, User, Phone, MapPin, Loader2, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NewClientButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              name: "",
              address: "",
              phone: "",
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.name || !formData.address) {
                     toast.error("Nombre y dirección son obligatorios");
                     return;
              }

              setLoading(true);
              const result = await createClient(formData);
              if (result.success) {
                     toast.success("¡Cliente guardado exitosamente!");
                     setIsOpen(false);
                     setFormData({ name: "", address: "", phone: "" });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            size="lg"
                            className="shadow-lg shadow-primary/20 rounded-xl px-6 flex items-center gap-2 font-bold tracking-tight"
                     >
                            <Plus className="w-5 h-5" />
                            <span>NUEVO CLIENTE</span>
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
                                          {/* Backdrop */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 className="relative w-full max-w-lg bg-background sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                                                                      <User className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground">Nuevo Cliente</h3>
                                                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Registro de usuario</p>
                                                               </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-9 h-9 border border-border">
                                                               <X className="w-5 h-5" />
                                                        </Button>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                                        <div className="space-y-4">
                                                               <div className="space-y-1.5 px-1">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nombre Completo</label>
                                                                      <div className="relative group">
                                                                             <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    autoFocus
                                                                                    value={formData.name}
                                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                    placeholder="Juan Pérez"
                                                                                    className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-1.5 px-1">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dirección de Entrega</label>
                                                                      <div className="relative group">
                                                                             <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.address}
                                                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                                    placeholder="Calle y número"
                                                                                    className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-1.5 px-1">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Teléfono / WhatsApp</label>
                                                                      <div className="relative group">
                                                                             <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.phone}
                                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                                    placeholder="Ej: 11 2233 4455"
                                                                                    className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="flex gap-3 pt-2">
                                                               <Button
                                                                      type="button"
                                                                      variant="ghost"
                                                                      className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border border-border"
                                                                      onClick={() => setIsOpen(false)}
                                                               >
                                                                      Cancelar
                                                               </Button>
                                                               <Button
                                                                      type="submit"
                                                                      disabled={loading}
                                                                      className="flex-[2] h-12 shadow-lg shadow-primary/20 rounded-xl font-bold text-xs uppercase tracking-widest"
                                                               >
                                                                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                             <span className="flex items-center gap-2">
                                                                                    GUARDAR CLIENTE
                                                                                    <ArrowRight className="w-4 h-4" />
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
