"use strict";
"use client";

import { useState } from "react";
import { Plus, X, User, Phone, MapPin, Loader2, Save, ArrowRight, UserPlus, Check } from "lucide-react";
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
                     toast.error("Nombre y dirección son obligatorios", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     return;
              }

              setLoading(true);
              const result = await createClient(formData);
              if (result.success) {
                     toast.success("¡Cliente guardado exitosamente!", {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
                     setIsOpen(false);
                     setFormData({ name: "", address: "", phone: "" });
              } else {
                     toast.error("Error: " + result.error, {
                            style: { borderRadius: '1rem', fontWeight: '800' }
                     });
              }
              setLoading(false);
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 bg-primary text-white shadow-xl shadow-primary/25 rounded-2xl px-10 flex items-center gap-3 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                     >
                            <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                            <span>Añadir Cliente</span>
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

                                          {/* iOS Style Side/Bottom Modal */}
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
                                                 className="relative w-full max-w-xl h-[85vh] lg:h-auto bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 {/* Header / Grabber */}
                                                 <div className="flex flex-col items-center pt-3 pb-8 sticky top-0 bg-white/90 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">Nuevo Perfil</h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Alta de Cliente</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => setIsOpen(false)}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-6 h-6" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-32">
                                                        <div className="space-y-8">
                                                               {/* Input sections with iOS design */}
                                                               <div className="space-y-3">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                                                                             <User className="w-3.5 h-3.5" /> Nombre y Apellido
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    autoFocus
                                                                                    value={formData.name}
                                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                    placeholder="Ej: Juan Silva"
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-6 text-base font-bold text-foreground placeholder:text-slate-300 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-3">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                                                                             <MapPin className="w-3.5 h-3.5" /> Domicilio Real
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={formData.address}
                                                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                                    placeholder="Ej: Av. Rivadavia 1234, CABA"
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-6 text-base font-bold text-foreground placeholder:text-slate-300 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               <div className="space-y-3">
                                                                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                                                                             <Phone className="w-3.5 h-3.5" /> Contacto WhatsApp
                                                                      </label>
                                                                      <div className="relative group">
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.phone}
                                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                                    placeholder="Ej: 11 1234-5678"
                                                                                    className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-6 text-base font-bold text-foreground placeholder:text-slate-300 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>
                                                               </div>

                                                               {/* Visual Decoration / Info */}
                                                               <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100/50 flex items-center gap-6 group">
                                                                      <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                                                             <UserPlus className="w-7 h-7" />
                                                                      </div>
                                                                      <div className="flex-1">
                                                                             <h4 className="text-sm font-black text-indigo-900 tracking-tight">Registro de Auditoría</h4>
                                                                             <p className="text-[11px] font-bold text-indigo-400 leading-tight mt-1 uppercase tracking-tighter shadow-sm">El cliente se añadirá con saldo en $0.00 por defecto.</p>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </form>

                                                 {/* Action Bar iOS Glass Style */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               type="button"
                                                               variant="ghost"
                                                               className="h-16 flex-1 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 active:scale-95 transition-all outline-none"
                                                               onClick={() => setIsOpen(false)}
                                                        >
                                                               Cerrar
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
                                                                             Confirmar Alta
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
