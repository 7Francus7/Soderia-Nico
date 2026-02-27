"use strict";
"use client";

import { useState } from "react";
import { X, UserPlus, MapPin, Phone, Map, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/actions/clients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewClientButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [formData, setFormData] = useState({
              name: "",
              address: "",
              phone: "",
              zone: ""
       });

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!formData.name || !formData.address) {
                     toast.error("Nombre y dirección son obligatorios");
                     return;
              }

              setLoading(true);
              try {
                     const result = await createClient(formData);
                     if (result.success) {
                            toast.success("Cliente registrado con éxito");
                            setIsOpen(false);
                            setFormData({ name: "", address: "", phone: "", zone: "" });
                     } else {
                            toast.error(result.error || "Error al registrar cliente");
                     }
              } catch (e) {
                     toast.error("Error inesperado en el servidor");
              } finally {
                     setLoading(false);
              }
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="w-full md:w-auto px-8 h-14 rounded-2xl bg-white hover:bg-white/90 text-black font-black tracking-widest group border-none transition-all hover:scale-105 active:scale-95 shadow-2xl"
                     >
                            <UserPlus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            NUEVO CLIENTE
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          {/* Header */}
                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <UserPlus className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black tracking-tight uppercase italic">Alta de Cliente</h3>
                                                               <p className="text-sm text-muted-foreground font-medium italic opacity-60">Nuevo registro Maestro.</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl hover:bg-white/5">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="space-y-2">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Nombre Completo</label>
                                                               <input
                                                                      type="text"
                                                                      required
                                                                      value={formData.name}
                                                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 text-white"
                                                                      placeholder="Ej: Juan Pérez"
                                                               />
                                                        </div>

                                                        <div className="space-y-2">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Dirección / Calle</label>
                                                               <div className="relative">
                                                                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.address}
                                                                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                             className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                                                                             placeholder="Ej: Av. Principal 1234"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Teléfono</label>
                                                                      <div className="relative">
                                                                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.phone}
                                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                                                                                    placeholder="341-..."
                                                                             />
                                                                      </div>
                                                               </div>
                                                               <div className="space-y-2">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Zona</label>
                                                                      <div className="relative">
                                                                             <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.zone}
                                                                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                                                                                    placeholder="Ej: Centro"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-4 pt-4 border-t border-white/5">
                                                        <Button type="button" variant="ghost" className="flex-1 rounded-xl font-bold text-xs uppercase tracking-[0.2em]" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] h-14 rounded-2xl bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:bg-white/10">
                                                               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cliente"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </>
       );
}
