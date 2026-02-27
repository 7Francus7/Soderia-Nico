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
                     <Button onClick={() => setIsOpen(true)} className="gap-2 rounded-xl h-12 px-6 shadow-sm">
                            <UserPlus className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Nuevo Cliente</span>
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
                                   <div className="bg-card w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">

                                          {/* Header */}
                                          <div className="px-8 py-6 flex justify-between items-center border-b border-border">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                                               <UserPlus className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-xl font-bold tracking-tight">Alta de Cliente</h3>
                                                               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Nuevo registro Maestro</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl h-10 w-10">
                                                        <X className="w-5 h-5" />
                                                 </Button>
                                          </div>

                                          <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
                                                               <input
                                                                      type="text"
                                                                      required
                                                                      value={formData.name}
                                                                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                      className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:opacity-30"
                                                                      placeholder="Ej: Juan Pérez"
                                                               />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Dirección / Calle</label>
                                                               <div className="relative">
                                                                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                                                                      <input
                                                                             type="text"
                                                                             required
                                                                             value={formData.address}
                                                                             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                             className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:opacity-30"
                                                                             placeholder="Ej: Av. Principal 1234"
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                               <div className="space-y-1.5">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Teléfono</label>
                                                                      <div className="relative">
                                                                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.phone}
                                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                                    className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:opacity-30"
                                                                                    placeholder="341-..."
                                                                             />
                                                                      </div>
                                                               </div>
                                                               <div className="space-y-1.5">
                                                                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Zona</label>
                                                                      <div className="relative">
                                                                             <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                                                                             <input
                                                                                    type="text"
                                                                                    value={formData.zone}
                                                                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                                                                    className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:opacity-30"
                                                                                    placeholder="Ej: Centro"
                                                                             />
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="flex gap-3 pt-6 border-t border-border">
                                                        <Button type="button" variant="ghost" className="flex-1 rounded-xl h-12 text-xs font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" disabled={loading} className="flex-[2] rounded-xl h-12 text-xs font-bold uppercase tracking-widest">
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
