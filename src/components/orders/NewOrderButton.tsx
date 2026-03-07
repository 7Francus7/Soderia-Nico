"use strict";
"use client";

import { useState, useEffect } from "react";
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
                            size="lg"
                            className="shadow-lg shadow-primary/20 rounded-xl px-6 flex items-center gap-2 font-bold tracking-tight"
                     >
                            <Plus className="w-5 h-5" />
                            <span>NUEVO PEDIDO</span>
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

                                          {/* Modal Container */}
                                          <motion.div
                                                 initial={{ y: "100%" }}
                                                 animate={{ y: 0 }}
                                                 exit={{ y: "100%" }}
                                                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                 className="relative w-full max-w-4xl h-[95vh] sm:h-[85vh] bg-background sm:rounded-2xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col"
                                          >
                                                 {/* Header */}
                                                 <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
                                                        <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                                                                      <ShoppingBag className="w-5 h-5" />
                                                               </div>
                                                               <div>
                                                                      <h3 className="text-lg font-bold text-foreground">Crear Pedido</h3>
                                                                      <div className="flex items-center gap-2 mt-0.5">
                                                                             <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", step === 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Paso 1</div>
                                                                             <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                                                                             <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Paso 2</div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                        <Button
                                                               variant="ghost"
                                                               size="icon"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                               className="rounded-full w-9 h-9 border border-border"
                                                        >
                                                               <X className="w-5 h-5" />
                                                        </Button>
                                                 </div>

                                                 {/* Body Content */}
                                                 <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                                                        {/* STEP 1: CLIENT PICKER */}
                                                        {step === 1 && (
                                                               <motion.div
                                                                      initial={{ opacity: 0, x: -10 }}
                                                                      animate={{ opacity: 1, x: 0 }}
                                                                      className="space-y-4"
                                                               >
                                                                      <div className="relative">
                                                                             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                             <input
                                                                                    type="text"
                                                                                    placeholder="Buscar cliente por nombre o dirección..."
                                                                                    autoFocus
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                    className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                                                             />
                                                                      </div>

                                                                      <div className="grid grid-cols-1 gap-2">
                                                                             {filteredClients.slice(0, 10).map(client => (
                                                                                    <button
                                                                                           key={client.id}
                                                                                           onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                           className="w-full flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group text-left shadow-sm active:scale-[0.99]"
                                                                                    >
                                                                                           <div className="flex items-center gap-4">
                                                                                                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                                                                                                         <User className="w-5 h-5" />
                                                                                                  </div>
                                                                                                  <div>
                                                                                                         <div className="font-bold text-base text-foreground">{client.name}</div>
                                                                                                         <div className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">{client.address}</div>
                                                                                                  </div>
                                                                                           </div>
                                                                                           <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-all" />
                                                                                    </button>
                                                                             ))}
                                                                             {search && filteredClients.length === 0 && (
                                                                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                                                                                           <Search className="w-12 h-12 mb-3" />
                                                                                           <p className="font-bold uppercase tracking-widest text-[10px]">Sin resultados</p>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                               </motion.div>
                                                        )}

                                                        {/* STEP 2: PRODUCTS */}
                                                        {step === 2 && (
                                                               <motion.div
                                                                      initial={{ opacity: 0, x: 10 }}
                                                                      animate={{ opacity: 1, x: 0 }}
                                                                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                                               >
                                                                      {/* Products List */}
                                                                      <div className="space-y-4">
                                                                             <div className="flex items-center justify-between px-1">
                                                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Productos</h4>
                                                                                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Cambiar Cliente</button>
                                                                             </div>
                                                                             <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                                                                                    {products.map(product => {
                                                                                           const inCart = orderItems.find(i => i.productId === product.id);
                                                                                           return (
                                                                                                  <button
                                                                                                         key={product.id}
                                                                                                         onClick={() => addItem(product)}
                                                                                                         className={cn(
                                                                                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all border shadow-sm",
                                                                                                                inCart ? "bg-primary/5 border-primary/30" : "bg-white border-border hover:border-primary/50"
                                                                                                         )}
                                                                                                  >
                                                                                                         <div className="flex items-center gap-3">
                                                                                                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-all", inCart ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                                                                                                       <Box className="w-5 h-5" />
                                                                                                                </div>
                                                                                                                <div className="text-left">
                                                                                                                       <div className="font-bold text-sm text-foreground">{product.name}</div>
                                                                                                                       <div className="text-[11px] font-bold text-primary">${product.price.toLocaleString()}</div>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                         <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all", inCart ? "bg-primary border-primary text-white" : "border-border text-muted-foreground")}>
                                                                                                                <Plus className="w-4 h-4" />
                                                                                                         </div>
                                                                                                  </button>
                                                                                           );
                                                                                    })}
                                                                             </div>
                                                                      </div>

                                                                      {/* Cart Summary */}
                                                                      <div className="space-y-4">
                                                                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Pedido Actual</h4>
                                                                             <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col min-h-[300px]">
                                                                                    <div className="flex-1 space-y-2 mb-4">
                                                                                           {orderItems.length === 0 ? (
                                                                                                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 py-10 opacity-60">
                                                                                                         <ShoppingBag className="w-12 h-12 mb-2" />
                                                                                                         <p className="text-[10px] font-bold uppercase tracking-widest text-center">Carrito vacío</p>
                                                                                                  </div>
                                                                                           ) : (
                                                                                                  orderItems.map(item => (
                                                                                                         <div key={item.productId} className="flex justify-between items-center bg-white p-3 rounded-lg border border-border shadow-sm">
                                                                                                                <div className="flex flex-col">
                                                                                                                       <span className="text-sm font-bold text-foreground">{item.name}</span>
                                                                                                                       <span className="text-[10px] font-bold text-primary">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                                                                                </div>
                                                                                                                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                                                                                                                       <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 bg-white rounded border border-border flex items-center justify-center text-foreground hover:bg-slate-50 transition-all shadow-sm">
                                                                                                                              <Minus className="w-3.5 h-3.5" />
                                                                                                                       </button>
                                                                                                                       <span className="text-sm font-bold w-6 text-center text-foreground">{item.quantity}</span>
                                                                                                                       <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 bg-white rounded border border-border flex items-center justify-center text-foreground hover:bg-slate-50 transition-all shadow-sm">
                                                                                                                              <Plus className="w-3.5 h-3.5" />
                                                                                                                       </button>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                  ))
                                                                                           )}
                                                                                    </div>

                                                                                    <div className="pt-4 border-t border-border mt-auto">
                                                                                           <div className="flex justify-between items-end">
                                                                                                  <div>
                                                                                                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total a Pagar</p>
                                                                                                         <p className="text-3xl font-bold tracking-tight text-foreground leading-none">${total.toLocaleString()}</p>
                                                                                                  </div>
                                                                                                  <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                                                                                         <Check className="w-6 h-6" />
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>

                                                                             <div className="space-y-2">
                                                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Observaciones</label>
                                                                                    <textarea
                                                                                           placeholder="Notas para el chofer..."
                                                                                           value={notes}
                                                                                           onChange={(e) => setNotes(e.target.value)}
                                                                                           className="w-full h-24 bg-white border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm resize-none"
                                                                                    />
                                                                             </div>
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </div>

                                                 {/* Footer */}
                                                 <div className="p-4 border-t border-border bg-white flex gap-3 sticky bottom-0 z-20">
                                                        <Button
                                                               variant="ghost"
                                                               className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border border-border"
                                                               onClick={() => { setIsOpen(false); reset(); }}
                                                        >
                                                               Cancelar
                                                        </Button>
                                                        {step === 2 && (
                                                               <Button
                                                                      disabled={loading || orderItems.length === 0}
                                                                      onClick={handleSubmit}
                                                                      className="flex-[2] h-12 shadow-lg shadow-primary/20 rounded-xl font-bold text-xs uppercase tracking-widest"
                                                               >
                                                                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "CONFIRMAR PEDIDO"}
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
