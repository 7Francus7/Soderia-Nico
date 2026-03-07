"use strict";
"use client";

import { useState, useEffect } from "react";
import { Plus, X, ShoppingBag, User, Box, Search, Trash2, Loader2, Minus, ChevronRight, Check, ArrowLeft } from "lucide-react";
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

       // Data for pickers
       const [clients, setClients] = useState<any[]>([]);
       const [products, setProducts] = useState<any[]>([]);

       // Form State
       const [step, setStep] = useState(1); // 1: Client, 2: Products
       const [selectedClient, setSelectedClient] = useState<any>(null);
       const [orderItems, setOrderItems] = useState<any[]>([]);
       const [notes, setNotes] = useState("");
       const [search, setSearch] = useState("");

       useEffect(() => {
              if (isOpen) {
                     loadData();
              }
       }, [isOpen]);

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
       };

       const handleSubmit = async () => {
              if (!selectedClient || orderItems.length === 0) return;
              setLoading(true);
              try {
                     const result = await createOrder({
                            clientId: selectedClient.id,
                            notes,
                            items: orderItems.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice }))
                     });
                     if (result.success) {
                            toast.success("Pedido confirmado correctamente");
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
                            onClick={() => setIsOpen(true)}
                            className="h-14 bg-primary text-white shadow-xl shadow-primary/25 rounded-2xl px-8 flex items-center gap-3 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                     >
                            <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                            <span>Nuevo Pedido</span>
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
                                                 className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"
                                          />

                                          {/* iOS Style Modal Container */}
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
                                                 className="relative w-full max-w-4xl h-[94vh] lg:h-full bg-white rounded-t-[3rem] lg:rounded-[3rem] shadow-[0_-25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                                          >
                                                 {/* Swipe Handle & Header */}
                                                 <div className="flex flex-col items-center pt-3 pb-6 sticky top-0 bg-white/90 backdrop-blur-md z-30">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-6" />
                                                        <div className="w-full px-8 flex items-center justify-between">
                                                               <div className="flex flex-col">
                                                                      <h3 className="text-2xl font-black text-foreground tracking-tight">Nueva Venta</h3>
                                                                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Paso {step} de 2</span>
                                                               </div>
                                                               <button
                                                                      onClick={() => { setIsOpen(false); reset(); }}
                                                                      className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                                                               >
                                                                      <X className="w-5 h-5" />
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <div className="flex-1 overflow-y-auto px-8 pb-32 scroll-smooth">
                                                        {/* STEP 1: CLIENT SELECTION */}
                                                        {step === 1 && (
                                                               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                                                      <div className="relative group">
                                                                             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                                             <input
                                                                                    type="text"
                                                                                    placeholder="Buscar Cliente..."
                                                                                    autoFocus
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                    className="w-full h-16 bg-slate-50/50 border-2 border-slate-100 rounded-3xl pl-12 pr-6 text-base font-bold text-foreground placeholder-slate-300 focus:outline-none focus:border-primary/30 focus:bg-white transition-all shadow-inner"
                                                                             />
                                                                      </div>

                                                                      <div className="space-y-3">
                                                                             {filteredClients.slice(0, 15).map(client => (
                                                                                    <button
                                                                                           key={client.id}
                                                                                           onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                           className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.2rem] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all group lg:p-7"
                                                                                    >
                                                                                           <div className="flex items-center gap-5">
                                                                                                  <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                                                                                         <User className="w-7 h-7" />
                                                                                                  </div>
                                                                                                  <div className="flex flex-col text-left">
                                                                                                         <span className="font-black text-lg text-foreground leading-tight tracking-tight">{client.name}</span>
                                                                                                         <span className="text-sm font-semibold text-muted-foreground/60">{client.address}</span>
                                                                                                  </div>
                                                                                           </div>
                                                                                           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:text-primary transition-colors">
                                                                                                  <ChevronRight className="w-6 h-6" />
                                                                                           </div>
                                                                                    </button>
                                                                             ))}
                                                                      </div>
                                                               </motion.div>
                                                        )}

                                                        {/* STEP 2: PRODUCTS */}
                                                        {step === 2 && (
                                                               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                                                      {/* Selected Client Summary Widget */}
                                                                      <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-[2.5rem]">
                                                                             <div className="flex items-center gap-4">
                                                                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white"><User className="w-6 h-6" /></div>
                                                                                    <div className="flex flex-col">
                                                                                           <span className="text-sm font-black text-foreground">{selectedClient?.name}</span>
                                                                                           <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{selectedClient?.address}</span>
                                                                                    </div>
                                                                             </div>
                                                                             <button onClick={() => setStep(1)} className="p-3 bg-white border border-primary/10 rounded-2xl text-primary font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-sm">Cambiar</button>
                                                                      </div>

                                                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                                             {/* Products Grid */}
                                                                             <div className="space-y-6">
                                                                                    <div className="flex items-center gap-2 px-1">
                                                                                           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                                           <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Catálogo de Productos</h4>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-1 gap-3 pr-2">
                                                                                           {products.map(product => {
                                                                                                  const inCart = orderItems.find(i => i.productId === product.id);
                                                                                                  return (
                                                                                                         <button
                                                                                                                key={product.id}
                                                                                                                onClick={() => addItem(product)}
                                                                                                                className={cn(
                                                                                                                       "w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all active:scale-95",
                                                                                                                       inCart ? "bg-primary/5 border-primary shadow-lg shadow-primary/10 scale-[1.02]" : "bg-white border-slate-50 hover:border-slate-100 shadow-sm"
                                                                                                                )}
                                                                                                         >
                                                                                                                <div className="flex items-center gap-4">
                                                                                                                       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", inCart ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-50 text-slate-300")}>
                                                                                                                              <Box className="w-7 h-7" />
                                                                                                                       </div>
                                                                                                                       <div className="flex flex-col text-left">
                                                                                                                              <span className="font-black text-base text-foreground tracking-tight">{product.name}</span>
                                                                                                                              <span className="text-sm font-bold text-primary">${product.price.toLocaleString()}</span>
                                                                                                                       </div>
                                                                                                                </div>
                                                                                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", inCart ? "bg-primary text-white" : "bg-slate-50 text-slate-300")}>
                                                                                                                       <Plus className="w-5.5 h-5.5 stroke-[3px]" />
                                                                                                                </div>
                                                                                                         </button>
                                                                                                  );
                                                                                           })}
                                                                                    </div>
                                                                             </div>

                                                                             {/* Summary Column */}
                                                                             <div className="space-y-6">
                                                                                    <div className="flex items-center gap-2 px-1">
                                                                                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                                           <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Pedido Actual</h4>
                                                                                    </div>
                                                                                    <div className="bg-slate-50/50 border-2 border-slate-100 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col shadow-inner">
                                                                                           <div className="flex-1 space-y-4">
                                                                                                  {orderItems.length === 0 ? (
                                                                                                         <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10 opacity-60">
                                                                                                                <ShoppingBag className="w-16 h-16 mb-4 stroke-[1.5px]" />
                                                                                                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-center">Sin productos seleccionados</p>
                                                                                                         </div>
                                                                                                  ) : (
                                                                                                         <AnimatePresence mode="popLayout">
                                                                                                                {orderItems.map(item => (
                                                                                                                       <motion.div
                                                                                                                              layout
                                                                                                                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                                                                              animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                                                                              exit={{ opacity: 0, scale: 0.8 }}
                                                                                                                              key={item.productId}
                                                                                                                              className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all"
                                                                                                                       >
                                                                                                                              <div className="flex flex-col px-1">
                                                                                                                                     <span className="font-black text-foreground text-base tracking-tight">{item.name}</span>
                                                                                                                                     <span className="text-xs font-bold text-primary opacity-60">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                                                                                              </div>
                                                                                                                              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl shadow-inner">
                                                                                                                                     <button onClick={() => updateQty(item.productId, -1)} className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-foreground hover:bg-slate-50 active:scale-90 transition-all shadow-sm">
                                                                                                                                            <Minus className="w-4 h-4 stroke-[3px]" />
                                                                                                                                     </button>
                                                                                                                                     <span className="text-base font-black w-7 text-center text-foreground">{item.quantity}</span>
                                                                                                                                     <button onClick={() => updateQty(item.productId, 1)} className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-foreground hover:bg-slate-50 active:scale-90 transition-all shadow-sm">
                                                                                                                                            <Plus className="w-4 h-4 stroke-[3px]" />
                                                                                                                                     </button>
                                                                                                                              </div>
                                                                                                                       </motion.div>
                                                                                                                ))}
                                                                                                         </AnimatePresence>
                                                                                                  )}
                                                                                           </div>

                                                                                           <div className="pt-10 space-y-8">
                                                                                                  <div className="flex flex-col gap-2">
                                                                                                         <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 px-2">Total del Pedido</label>
                                                                                                         <div className="flex items-end gap-2 px-2">
                                                                                                                <span className="text-5xl font-black tracking-tighter text-foreground">${total.toLocaleString()}</span>
                                                                                                                <div className="mb-2 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                                                                                                         </div>
                                                                                                  </div>

                                                                                                  <div className="space-y-3">
                                                                                                         <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 px-2">Notas Especiales</label>
                                                                                                         <textarea
                                                                                                                placeholder="Escribir instrucciones aquí..."
                                                                                                                value={notes}
                                                                                                                onChange={(e) => setNotes(e.target.value)}
                                                                                                                className="w-full h-28 bg-white border-2 border-slate-100 rounded-[2rem] p-5 text-sm font-semibold text-foreground placeholder-slate-200 focus:outline-none focus:border-primary/20 transition-all shadow-inner resize-none"
                                                                                                         />
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </div>

                                                 {/* Sticky iOS Glass Action Bar */}
                                                 <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 pb-12 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4">
                                                        <Button
                                                               variant="ghost"
                                                               className="h-16 flex-1 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-400 border border-slate-100 active:bg-slate-50 active:scale-95 transition-all outline-none ring-0"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        {step === 2 ? (
                                                               <Button
                                                                      disabled={loading || orderItems.length === 0}
                                                                      onClick={handleSubmit}
                                                                      className="h-16 flex-[2] bg-primary text-white shadow-2xl shadow-primary/30 rounded-3xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all"
                                                               >
                                                                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmar Venta"}
                                                               </Button>
                                                        ) : (
                                                               <Button
                                                                      disabled={!selectedClient}
                                                                      onClick={() => setStep(2)}
                                                                      className="h-16 flex-[2] bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-2"
                                                               >
                                                                      Siguiente <ChevronRight className="w-5 h-5" />
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
