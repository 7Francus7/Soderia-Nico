"use strict";
"use client";

import { useState, useEffect } from "react";
import { Plus, X, ShoppingBag, UserCheck, Box, Search, Loader2, Minus, ChevronRight, Check, ArrowRight, PackageOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/actions/orders";
import { getClients } from "@/actions/clients";
import { getProducts } from "@/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NewOrderButton() {
       const [isOpen, setIsOpen] = useState(false);
       const [loading, setLoading] = useState(false);
       const [idempotencyKey, setIdempotencyKey] = useState("");

       // Data for pickers
       const [clients, setClients] = useState<any[]>([]);
       const [products, setProducts] = useState<any[]>([]);

       // Form State
       const [step, setStep] = useState(1); // 1: Client, 2: Products
       const [selectedClient, setSelectedClient] = useState<any>(null);
       const [orderItems, setOrderItems] = useState<any[]>([]);
       const [notes, setNotes] = useState("");
       const [search, setSearch] = useState("");

       const openModal = () => {
              setIsOpen(true);
              setIdempotencyKey(`order-${Date.now()}-${Math.random().toString(36).substring(7)}`);
              loadData();
       };

       const loadData = async () => {
              const [cRes, pRes] = await Promise.all([getClients(), getProducts()]);
              if (cRes.success && cRes.data) setClients(cRes.data);
              if (pRes.success && pRes.data) setProducts(pRes.data);
       };

       const addItem = (product: any) => {
              const existing = orderItems.find(item => item.productId === product.id);
              if (existing) {
                     setOrderItems(orderItems.map(item =>
                            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                     ));
              } else {
                     setOrderItems([...orderItems, {
                            productId: product.id,
                            name: product.name,
                            quantity: 1,
                            unitPrice: product.price
                     }]);
              }
       };

       const updateQty = (productId: number, delta: number) => {
              setOrderItems(v => v.map(item => {
                     if (item.productId === productId) {
                            const newQty = Math.max(0, item.quantity + delta);
                            return { ...item, quantity: newQty };
                     }
                     return item;
              }).filter(i => i.quantity > 0));
       };

       const reset = () => {
              setStep(1);
              setSelectedClient(null);
              setOrderItems([]);
              setNotes("");
              setSearch("");
              setIdempotencyKey("");
       };

       const handleSubmit = async () => {
              if (!selectedClient || orderItems.length === 0) return;
              setLoading(true);
              try {
                     const result = await createOrder({
                            clientId: selectedClient.id,
                            notes,
                            items: orderItems.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
                            idempotencyKey
                     });
                     if (result.success) {
                            toast.success("¡Pedido confirmado con éxito!");
                            setIsOpen(false);
                            reset();
                     } else {
                            toast.error(result.error || "Error al crear pedido");
                     }
              } catch (e) {
                     toast.error("Ocurrió un error inesperado");
              } finally {
                     setLoading(false);
              }
       };

       const filteredClients = clients.filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.address.toLowerCase().includes(search.toLowerCase())
       );

       const total = orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

       return (
              <>
                     <Button
                            onClick={openModal}
                            className="h-16 bg-primary text-white shadow-2xl shadow-primary/30 rounded-[1.8rem] px-10 flex items-center gap-3 active:scale-95 transition-all text-[11px] font-black uppercase tracking-[0.2em] w-full sm:w-auto"
                     >
                            <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                            <span>Crear Pedido</span>
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 lg:p-10">
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => { setIsOpen(false); reset(); }}
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                                          />

                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                                 className="relative w-full max-w-5xl h-[95vh] lg:h-full bg-white rounded-t-[3.5rem] lg:rounded-[3.5rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 <div className="flex flex-col items-center pt-3 pb-8 bg-white/95 backdrop-blur-md z-30 flex-shrink-0">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                                                        <div className="w-full px-10 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-3xl font-black text-foreground tracking-tighter">Nueva Operación</h3>
                                                                      <div className="flex items-center gap-2 mt-1">
                                                                             <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500", step === 1 ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-emerald-50 text-emerald-500 border-emerald-100")}>
                                                                                    {step === 1 ? "1. Cliente" : "✓ Cliente Seleccionado"}
                                                                             </div>
                                                                             <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500", step === 2 ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-200 border-slate-100")}>
                                                                                    {step === 2 ? "2. Carrito" : "2. Selección"}
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                               <button
                                                                      onClick={() => { setIsOpen(false); reset(); }}
                                                                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                                                               >
                                                                      <X className="w-7 h-7" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto px-10 pb-40 scroll-smooth scrollbar-hide">
                                                        {step === 1 && (
                                                               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-3xl mx-auto pt-4">
                                                                      <div className="relative group w-full">
                                                                             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 stroke-[3px] group-focus-within:text-primary transition-colors" />
                                                                             <input
                                                                                    type="text"
                                                                                    placeholder="Buscar por nombre, dirección o ID..."
                                                                                    autoFocus
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                    className="w-full h-18 bg-slate-50 border-2 border-slate-50 rounded-[2.2rem] pl-16 pr-8 text-lg font-bold text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>

                                                                      <div className="grid grid-cols-1 gap-4">
                                                                             {filteredClients.slice(0, 15).map((client, idx) => (
                                                                                    <motion.button
                                                                                           key={client.id}
                                                                                           initial={{ opacity: 0, y: 20 }}
                                                                                           animate={{ opacity: 1, y: 0 }}
                                                                                           transition={{ delay: idx * 0.03 }}
                                                                                           onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                           className="w-full flex items-center justify-between p-7 bg-white border-2 border-slate-50 rounded-[2.8rem] hover:border-primary/20 hover:shadow-2xl hover:shadow-slate-200/50 active:scale-[0.98] transition-all group relative overflow-hidden"
                                                                                    >
                                                                                           <div className="flex items-center gap-6">
                                                                                                  <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-inner transition-all duration-500">
                                                                                                         <UserCheck className="w-8 h-8 stroke-[2.5px]" />
                                                                                                  </div>
                                                                                                  <div className="flex flex-col text-left">
                                                                                                         <span className="font-black text-xl text-foreground leading-tight tracking-tighter group-hover:text-primary transition-colors">{client.name}</span>
                                                                                                         <div className="flex items-center gap-2 mt-0.5 opacity-40">
                                                                                                                <MapPin className="w-3.5 h-3.5" />
                                                                                                                <span className="text-sm font-bold truncate max-w-[200px] uppercase tracking-widest">{client.address}</span>
                                                                                                         </div>
                                                                                                  </div>
                                                                                           </div>
                                                                                           <div className="w-14 h-14 rounded-full bg-slate-50/50 flex items-center justify-center text-slate-200 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:translate-x-1">
                                                                                                  <ChevronRight className="w-6 h-6 stroke-[3px]" />
                                                                                           </div>
                                                                                    </motion.button>
                                                                             ))}
                                                                      </div>
                                                               </motion.div>
                                                        )}

                                                        {step === 2 && (
                                                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 pt-4">
                                                                      <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-emerald-50/50 border-2 border-emerald-100/50 rounded-[3rem] gap-6">
                                                                             <div className="flex items-center gap-6">
                                                                                    <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                                                                           <UserCheck className="w-10 h-10 stroke-[2.5px]" />
                                                                                    </div>
                                                                                    <div className="flex flex-col">
                                                                                           <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-1">Cliente Activo</span>
                                                                                           <span className="text-3xl font-black text-foreground tracking-tighter leading-none">{selectedClient?.name}</span>
                                                                                           <span className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {selectedClient?.address}</span>
                                                                                    </div>
                                                                             </div>
                                                                             <button onClick={() => setStep(1)} className="h-14 px-8 bg-white border border-emerald-200 rounded-2xl text-emerald-500 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-transform shadow-sm whitespace-nowrap">Cambiar Cliente</button>
                                                                      </div>

                                                                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                                                                             <div className="xl:col-span-7 space-y-8">
                                                                                    <div className="flex items-center gap-3 px-2">
                                                                                           <PackageOpen className="w-5 h-5 text-primary opacity-40" />
                                                                                           <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Selección de Activos</h4>
                                                                                           <div className="h-px flex-1 bg-slate-50" />
                                                                                    </div>
                                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                           {products.map(product => {
                                                                                                  const inCart = orderItems.find(i => i.productId === product.id);
                                                                                                  return (
                                                                                                         <button
                                                                                                                key={product.id}
                                                                                                                onClick={() => addItem(product)}
                                                                                                                className={cn(
                                                                                                                       "w-full flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all duration-300 active:scale-95 text-left",
                                                                                                                       inCart ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-[1.02]" : "bg-white border-slate-50 hover:border-primary/20 shadow-sm"
                                                                                                                )}
                                                                                                         >
                                                                                                                <div className="flex items-center gap-4">
                                                                                                                       <div className={cn("w-16 h-16 rounded-[1.6rem] flex items-center justify-center transition-all", inCart ? "bg-white/20 text-white" : "bg-slate-50 text-slate-300")}>
                                                                                                                              <Box className="w-8 h-8 stroke-[2.5px]" />
                                                                                                                       </div>
                                                                                                                       <div className="flex flex-col">
                                                                                                                              <span className="font-black text-base leading-tight tracking-tight">{product.name}</span>
                                                                                                                              <span className={cn("text-sm font-bold mt-1", inCart ? "text-white/80" : "text-primary")}>${product.price.toLocaleString()}</span>
                                                                                                                       </div>
                                                                                                                </div>
                                                                                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", inCart ? "bg-white text-primary" : "bg-slate-50 text-slate-300")}>
                                                                                                                       <Plus className="w-6 h-6 stroke-[3.5px]" />
                                                                                                                </div>
                                                                                                         </button>
                                                                                                  );
                                                                                           })}
                                                                                    </div>
                                                                             </div>

                                                                             <div className="xl:col-span-5 space-y-8">
                                                                                    <div className="flex items-center gap-3 px-2">
                                                                                           <ShoppingBag className="w-5 h-5 text-emerald-500 opacity-40" />
                                                                                           <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Tu Carrito</h4>
                                                                                           <div className="h-px flex-1 bg-slate-50" />
                                                                                    </div>
                                                                                    <div className="bg-slate-50/70 border-2 border-slate-50 rounded-[3rem] p-8 min-h-[500px] flex flex-col shadow-inner relative overflow-hidden">
                                                                                           <div className="flex-1 space-y-4 relative z-10 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                                                                                                  <AnimatePresence mode="popLayout" initial={false}>
                                                                                                         {orderItems.length === 0 ? (
                                                                                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full py-20 flex flex-col items-center justify-center text-slate-300">
                                                                                                                       <ShoppingBag className="w-20 h-20 mb-6 opacity-20 stroke-[1.5px]" />
                                                                                                                       <p className="text-[11px] font-black uppercase tracking-[0.3em] text-center">Sin productos aún</p>
                                                                                                                </motion.div>
                                                                                                         ) : (
                                                                                                                orderItems.map(item => (
                                                                                                                       <motion.div
                                                                                                                              layout
                                                                                                                              initial={{ opacity: 0, scale: 0.9 }}
                                                                                                                              animate={{ opacity: 1, scale: 1 }}
                                                                                                                              exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                                                                                                              key={item.productId}
                                                                                                                              className="flex justify-between items-center bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm group"
                                                                                                                       >
                                                                                                                              <div className="flex flex-col gap-1">
                                                                                                                                     <span className="font-black text-foreground text-lg tracking-tighter leading-none">{item.name}</span>
                                                                                                                                     <span className="text-[11px] font-black text-primary uppercase tracking-widest">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                                                                                              </div>
                                                                                                                              <div className="flex items-center gap-4 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 shadow-inner">
                                                                                                                                     <button onClick={() => updateQty(item.productId, -1)} className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-foreground hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all shadow-sm">
                                                                                                                                            <Minus className="w-5 h-5 stroke-[2.5px]" />
                                                                                                                                     </button>
                                                                                                                                     <span className="text-xl font-black w-10 text-center text-foreground tabular-nums">{item.quantity}</span>
                                                                                                                                     <button onClick={() => updateQty(item.productId, 1)} className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary active:scale-90 transition-all shadow-sm">
                                                                                                                                            <Plus className="w-5 h-5 stroke-[2.5px]" />
                                                                                                                                     </button>
                                                                                                                              </div>
                                                                                                                       </motion.div>
                                                                                                                ))
                                                                                                         )}
                                                                                                  </AnimatePresence>
                                                                                           </div>

                                                                                           <div className="mt-auto pt-10 space-y-10 border-t border-slate-100 relative z-10 bg-gradient-to-t from-slate-50/90 to-transparent">
                                                                                                  <div className="flex flex-col gap-4">
                                                                                                         <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 px-2">Total Consolidado</label>
                                                                                                         <div className="flex items-baseline gap-2 px-2">
                                                                                                                <span className="text-sm font-black text-primary opacity-40 uppercase tracking-widest leading-none">$</span>
                                                                                                                <span className="text-6xl font-black tracking-tighter text-foreground leading-none tabular-nums">{total.toLocaleString()}</span>
                                                                                                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] ml-4" />
                                                                                                         </div>
                                                                                                  </div>

                                                                                                  <div className="space-y-4 px-1">
                                                                                                         <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">Instrucciones Especiales</label>
                                                                                                         <textarea
                                                                                                                placeholder="Escribir notas de despacho..."
                                                                                                                value={notes}
                                                                                                                onChange={(e) => setNotes(e.target.value)}
                                                                                                                className="w-full h-32 bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 text-base font-bold text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 transition-all shadow-xl shadow-slate-200/20 resize-none leading-relaxed"
                                                                                                         />
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </div>

                                                 <div className="absolute bottom-0 left-0 right-0 p-10 pt-4 pb-14 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               variant="ghost"
                                                               className="h-18 flex-1 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 transition-all outline-none"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        {step === 2 ? (
                                                               <Button
                                                                      disabled={loading || orderItems.length === 0}
                                                                      onClick={handleSubmit}
                                                                      className="h-18 flex-[2] bg-primary text-white shadow-2xl shadow-primary/40 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3"
                                                               >
                                                                      {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                                                                             <>
                                                                                    <Check className="w-7 h-7 stroke-[3px]" />
                                                                                    Confirmar Venta
                                                                             </>
                                                                      )}
                                                               </Button>
                                                        ) : (
                                                               <Button
                                                                      disabled={!selectedClient}
                                                                      onClick={() => setStep(2)}
                                                                      className="h-18 flex-[2] bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3"
                                                               >
                                                                      Continuar Pedido <ArrowRight className="w-7 h-7 stroke-[3px]" />
                                                               </Button>
                                                        )}
                                                 </div>
                                          </motion.div>
                                   </div>
                            )}
                     </AnimatePresence>
              </>
       );
}
