"use strict";
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, ShoppingBag, User, Box, Search, Trash2, Loader2, Minus, ChevronRight, Check } from "lucide-react";
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
              toast.success(`${product.name} añadido`, { duration: 1000 });
       };

       const updateQty = (productId: number, delta: number) => {
              setOrderItems(orderItems.map(item => {
                     if (item.productId === productId) {
                            const newQty = Math.max(1, item.quantity + delta);
                            return { ...item, quantity: newQty };
                     }
                     return item;
              }));
       };

       const removeItem = (productId: number) => {
              setOrderItems(orderItems.filter(item => item.productId !== productId));
       };

       const total = orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

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

       const reset = () => {
              setStep(1);
              setSelectedClient(null);
              setOrderItems([]);
              setNotes("");
              setSearch("");
       };

       const filteredClients = clients.filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.address.toLowerCase().includes(search.toLowerCase())
       );

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            variant="premium"
                            size="lg"
                            className="shadow-[0_20px_50px_rgba(255,255,255,0.1)] group"
                     >
                            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                            NUEVO PEDIDO
                     </Button>

                     <AnimatePresence>
                            {isOpen && (
                                   <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
                                          {/* Backdrop */}
                                          <motion.div
                                                 initial={{ opacity: 0 }}
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 onClick={() => setIsOpen(false)}
                                                 className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                                          />

                                          {/* Modal Container */}
                                          <motion.div
                                                 initial={{ y: "100%", opacity: 0, scale: 0.9 }}
                                                 animate={{ y: 0, opacity: 1, scale: 1 }}
                                                 exit={{ y: "100%", opacity: 0, scale: 0.9 }}
                                                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                 className="relative w-full max-w-4xl h-screen sm:h-[85vh] bg-neutral-950/50 sm:rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
                                          >
                                                 {/* Header Decoration */}
                                                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/10 rounded-full mt-4 block sm:hidden" />

                                                 {/* Header */}
                                                 <div className="p-10 pb-6 flex justify-between items-center relative z-10">
                                                        <div className="flex items-center gap-6">
                                                               <div className="w-16 h-16 bg-white flex items-center justify-center rounded-[2rem] shadow-2xl shadow-white/20">
                                                                      <ShoppingBag className="w-8 h-8 text-black" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-3xl font-black tracking-tight uppercase italic text-white leading-none">REGISTRO DE PEDIDO</h3>
                                                                      <div className="flex items-center gap-4 mt-3">
                                                                             <div className="flex items-center gap-2">
                                                                                    <div className={cn("w-2 h-2 rounded-full", step === 1 ? "bg-white animate-pulse" : "bg-white/20")} />
                                                                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", step === 1 ? "text-white" : "text-white/20")}>Selección Cliente</span>
                                                                             </div>
                                                                             <ChevronRight className="w-4 h-4 text-white/10" />
                                                                             <div className="flex items-center gap-2">
                                                                                    <div className={cn("w-2 h-2 rounded-full", step === 2 ? "bg-white animate-pulse" : "bg-white/20")} />
                                                                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", step === 2 ? "text-white" : "text-white/20")}>Productos</span>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <Button
                                                               variant="ghost"
                                                               size="icon"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                               className="rounded-full w-14 h-14 hover:bg-white/5 border border-white/5 text-white"
                                                        >
                                                               <X className="w-8 h-8" />
                                                        </Button>
                                                 </div>

                                                 {/* Body Content */}
                                                 <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar relative z-10">

                                                        {/* STEP 1: CLIENT PICKER */}
                                                        {step === 1 && (
                                                               <motion.div
                                                                      initial={{ opacity: 0, x: -20 }}
                                                                      animate={{ opacity: 1, x: 0 }}
                                                                      className="space-y-8"
                                                               >
                                                                      <div className="relative group">
                                                                             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-white transition-colors" />
                                                                             <input
                                                                                    type="text"
                                                                                    placeholder="Busca un cliente por nombre, calle o número..."
                                                                                    autoFocus
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 font-bold text-xl text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-white/10"
                                                                             />
                                                                      </div>

                                                                      <div className="grid grid-cols-1 gap-4">
                                                                             {filteredClients.slice(0, 10).map(client => (
                                                                                    <button
                                                                                           key={client.id}
                                                                                           onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                           className="w-full flex items-center justify-between p-7 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all group text-left relative overflow-hidden active:scale-[0.98]"
                                                                                    >
                                                                                           <div className="flex items-center gap-6 relative z-10">
                                                                                                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-white/20 transition-all">
                                                                                                         <User className="w-7 h-7" />
                                                                                                  </div>
                                                                                                  <div>
                                                                                                         <div className="font-black text-2xl text-white tracking-tight">{client.name}</div>
                                                                                                         <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{client.address}</div>
                                                                                                  </div>
                                                                                           </div>
                                                                                           <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all relative z-10">
                                                                                                  <ChevronRight className="w-6 h-6" />
                                                                                           </div>
                                                                                    </button>
                                                                             ))}
                                                                             {search && filteredClients.length === 0 && (
                                                                                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                                                                           <Search className="w-16 h-16 mb-4" />
                                                                                           <p className="font-black uppercase tracking-[0.3em] text-sm">No hay resultados para "{search}"</p>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                               </motion.div>
                                                        )}

                                                        {/* STEP 2: PRODUCT SELECTION & CART */}
                                                        {step === 2 && (
                                                               <motion.div
                                                                      initial={{ opacity: 0, x: 20 }}
                                                                      animate={{ opacity: 1, x: 0 }}
                                                                      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                                                               >
                                                                      {/* Left Side: Client Info & Catalog */}
                                                                      <div className="lg:col-span-7 space-y-10">
                                                                             <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-between group">
                                                                                    <div className="flex items-center gap-6">
                                                                                           <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center">
                                                                                                  <User className="w-7 h-7" />
                                                                                           </div>
                                                                                           <div>
                                                                                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Cliente Seleccionado</p>
                                                                                                  <p className="font-black text-2xl tracking-tighter text-white">{selectedClient.name}</p>
                                                                                           </div>
                                                                                    </div>
                                                                                    <Button
                                                                                           variant="ghost"
                                                                                           className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 text-white/60 hover:text-white"
                                                                                           onClick={() => setStep(1)}
                                                                                    >
                                                                                           CAMBIAR
                                                                                    </Button>
                                                                             </div>

                                                                             <div className="space-y-6">
                                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4">Catálogo de Productos</h4>
                                                                                    <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[40vh] pr-4 custom-scrollbar">
                                                                                           {products.map(product => {
                                                                                                  const inCart = orderItems.find(i => i.productId === product.id);
                                                                                                  return (
                                                                                                         <button
                                                                                                                key={product.id}
                                                                                                                onClick={() => addItem(product)}
                                                                                                                className={cn(
                                                                                                                       "w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all group active:scale-[0.98] border",
                                                                                                                       inCart ? "bg-white/10 border-white/30" : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                                                                                                                )}
                                                                                                         >
                                                                                                                <div className="flex items-center gap-5">
                                                                                                                       <div className={cn(
                                                                                                                              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                                                                                                              inCart ? "bg-white text-black" : "bg-black/40 text-white/20 group-hover:text-white"
                                                                                                                       )}>
                                                                                                                              {inCart ? <Check className="w-7 h-7" /> : <Box className="w-7 h-7" />}
                                                                                                                       </div>
                                                                                                                       <div className="text-left">
                                                                                                                              <div className="font-black text-lg text-white group-hover:translate-x-1 transition-transform">{product.name}</div>
                                                                                                                              <div className="font-black text-2xl text-white/50 tracking-tighter">${product.price.toLocaleString()}</div>
                                                                                                                       </div>
                                                                                                                </div>
                                                                                                                <div className={cn(
                                                                                                                       "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all",
                                                                                                                       inCart ? "bg-white border-white text-black" : "border-white/10 group-hover:bg-white group-hover:text-black"
                                                                                                                )}>
                                                                                                                       <Plus className="w-6 h-6" />
                                                                                                                </div>
                                                                                                         </button>
                                                                                                  );
                                                                                           })}
                                                                                    </div>
                                                                             </div>
                                                                      </div>

                                                                      {/* Right Side: Cart Summary */}
                                                                      <div className="lg:col-span-5 flex flex-col gap-6">
                                                                             <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden">
                                                                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                                                                           <ShoppingBag className="w-40 h-40" />
                                                                                    </div>

                                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 relative z-10">Resumen del Carrito</h4>

                                                                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                                                                           {orderItems.length === 0 ? (
                                                                                                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20">
                                                                                                         <ShoppingBag className="w-20 h-20 mb-4" />
                                                                                                         <p className="font-black uppercase tracking-[0.2em] text-xs">Añade productos para ver el total</p>
                                                                                                  </div>
                                                                                           ) : (
                                                                                                  orderItems.map(item => (
                                                                                                         <div key={item.productId} className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/5 group hover:border-white/20 transition-all">
                                                                                                                <div className="flex flex-col">
                                                                                                                       <span className="text-lg font-black text-white">{item.name}</span>
                                                                                                                       <span className="text-sm font-bold text-white/30 uppercase tracking-widest">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-4 bg-black/60 p-2 rounded-[1.5rem] border border-white/5">
                                                                                                                       <button
                                                                                                                              onClick={() => updateQty(item.productId, -1)}
                                                                                                                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-all active:scale-90"
                                                                                                                       >
                                                                                                                              <Minus className="w-5 h-5" />
                                                                                                                       </button>
                                                                                                                       <span className="text-xl font-black w-6 text-center text-white">{item.quantity}</span>
                                                                                                                       <button
                                                                                                                              onClick={() => updateQty(item.productId, 1)}
                                                                                                                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-all active:scale-90"
                                                                                                                       >
                                                                                                                              <Plus className="w-5 h-5" />
                                                                                                                       </button>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                  ))
                                                                                           )}
                                                                                    </div>

                                                                                    <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                                                                                           <div className="flex justify-between items-end">
                                                                                                  <div>
                                                                                                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Total Final</p>
                                                                                                         <p className="text-6xl font-black tracking-tighter text-white leading-none">${total.toLocaleString()}</p>
                                                                                                  </div>
                                                                                                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white ring-8 ring-white/[0.02]">
                                                                                                         <Check className="w-8 h-8" />
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>

                                                                             <div className="space-y-4">
                                                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4">Notas para el Chofer / Observaciones</label>
                                                                                    <textarea
                                                                                           placeholder="Instrucciones adicionales..."
                                                                                           value={notes}
                                                                                           onChange={(e) => setNotes(e.target.value)}
                                                                                           className="w-full h-32 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-lg font-bold text-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all resize-none placeholder:text-white/10 lg:h-32"
                                                                                    />
                                                                             </div>
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </div>

                                                 {/* Sticky Footer Action Bar */}
                                                 <div className="p-10 bg-black/40 backdrop-blur-3xl border-t border-white/10 flex gap-6 relative z-20">
                                                        <Button
                                                               variant="ghost"
                                                               className="flex-1 h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 text-white/40 hover:text-white"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        {step === 2 && (
                                                               <Button
                                                                      disabled={loading || orderItems.length === 0}
                                                                      onClick={handleSubmit}
                                                                      variant="action"
                                                                      size="xl"
                                                                      className="flex-[2.5] shadow-2xl shadow-primary/40 relative overflow-hidden group"
                                                               >
                                                                      <span className="relative z-10">
                                                                             {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : "CONFIRMAR PEDIDO"}
                                                                      </span>
                                                                      {/* Animated Background for the button */}
                                                                      <motion.div
                                                                             animate={{ x: ["-100%", "100%"] }}
                                                                             transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                                             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                                                      />
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
