"use client";

import { useState } from "react";
import { Plus, X, UserPlus, MapPin, Phone, Map } from "lucide-react";
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
              const result = await createClient(formData);
              if (result.success) {
                     toast.success("Cliente creado exitosamente");
                     setIsOpen(false);
                     setFormData({ name: "", address: "", phone: "", zone: "" });
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       return (
              <>
                     <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto px-8 h-14 rounded-2xl shadow-2xl">
                            <UserPlus className="w-5 h-5 mr-3" />
                            NUEVO CLIENTE
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-xl h-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <UserPlus className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black tracking-tight">Alta de Cliente</h3>
                                                               <p className="text-sm text-muted-foreground font-medium">Registrar un nuevo cliente en el sistema.</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="relative group">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-1 block">Nombre Completo</label>
                                                               <input
                                                                      type="text"
                                                                      required
                                                                      value={formData.name}
                                                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                      className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl px-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                      placeholder="Ej: Juan Pérez"
                                                               />
                                                        </div>

                                                        <div className="relative group">
                                                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-1 block">Dirección</label>
                                                               <div className="relative">
                                                                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.address}
                                                                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                             className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                             placeholder="Ej: Av. Principal 123"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                               <div className="relative group">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-1 block">Teléfono</label>
                                                                      <div className="relative">
                                                                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.phone}
                                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                                    className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                                    placeholder="Ej: 341 ..."
                                                                             />
                                                                      </div>
                                                               </div>
                                                               <div className="relative group">
                                                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-1 block">Zona</label>
                                                                      <div className="relative">
                                                                             <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.zone}
                                                                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                                                                    className="w-full h-14 bg-muted/20 border border-white/5 rounded-2xl pl-12 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-20"
                                                                                    placeholder="Ej: Sur"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-4 pt-4 border-t border-white/5">
                                                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] h-14 rounded-2xl shadow-xl">
                                                               {loading ? "Registrando..." : "Guardar Cliente"}
                                                        </Button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     )}
              </>
       );
}
