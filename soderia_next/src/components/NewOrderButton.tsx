"use strict";
"use client";

import { useState, useEffect } from "react";
import { Plus, X, ShoppingBag, User, Box, Search, Trash2, Loader2, Minus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/actions/orders";
import { getClients } from "@/actions/clients";
import { getProducts } from "@/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
              toast.success(`${product.name} agregado`);
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
              const result = await createOrder({
                     clientId: selectedClient.id,
                     notes,
                     items: orderItems.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice }))
              });
              if (result.success) {
                     toast.success("Pedido confirmado");
                     setIsOpen(false);
                     reset();
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       const reset = () => {
              setStep(1);
              setSelectedClient(null);
              setOrderItems([]);
              setNotes("");
              setSearch("");
       };

       const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
       const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

       return (
              <>
                     <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto px-10 h-16 rounded-[2rem] shadow-2xl bg-slate-900 text-white font-black tracking-[0.1em] uppercase group overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <Plus className="w-6 h-6 mr-3 relative z-10" />
                            <span className="relative z-10">Toma de Pedido</span>
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-2xl h-[95vh] sm:h-[80vh] flex flex-col rounded-t-[3rem] sm:rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-slide-in-up">

                                          {/* Modal Header */}
                                          <div className="p-8 pb-6 flex justify-between items-center bg-muted/20 border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                                               <ShoppingBag className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-3xl font-black tracking-tighter uppercase italic">Nuevo Pedido</h3>
                                                               <div className="flex items-center gap-2 mt-1">
                                                                      <div className={cn("w-2 h-2 rounded-full", step === 1 ? "bg-primary animate-pulse" : "bg-primary/20")} />
                                                                      <div className={cn("w-2 h-2 rounded-full", step === 2 ? "bg-primary animate-pulse" : "bg-primary/20")} />
                                                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                                                             {step === 1 ? "PASO 1: SELECCIONAR CLIENTE" : "PASO 2: PRODUCTOS Y TOTALES"}
                                                                      </span>
                                                               </div>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); reset(); }} className="rounded-[1.5rem] h-12 w-12 hover:bg-white/5">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          {/* Modal Body */}
                                          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                                                 {/* STEP 1: CLIENT SELECTOR */}
                                                 {step === 1 && (
                                                        <div className="space-y-6 animate-fade-in">
                                                               <div className="relative">
                                                                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                                                                      <input
                                                                             type="text"
                                                                             placeholder="Empezá a escribir nombre o dirección..."
                                                                             value={search}
                                                                             onChange={(e) => setSearch(e.target.value)}
                                                                             className="w-full h-16 bg-muted/10 border border-white/5 rounded-2xl pl-14 pr-5 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                                                      />
                                                               </div>

                                                               <div className="grid grid-cols-1 gap-3">
                                                                      {filteredClients.slice(0, 10).map(client => (
                                                                             <button
                                                                                    key={client.id}
                                                                                    onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                    className="flex items-center justify-between p-6 bg-card border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group text-left shadow-lg shadow-black/5"
                                                                             >
                                                                                    <div className="flex items-center gap-5">
                                                                                           <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                                                  <User className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                                                                           </div>
                                                                                           <div>
                                                                                                  <div className="font-black text-lg group-hover:text-primary transition-colors">{client.name}</div>
                                                                                                  <div className="text-xs font-bold text-muted-foreground italic">{client.address}</div>
                                                                                           </div>
                                                                                    </div>
                                                                                    <ChevronRight className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                                             </button>
                                                                      ))}
                                                                      {search && filteredClients.length === 0 && (
                                                                             <div className="text-center py-10 opacity-30 italic">No se encontraron clientes con ese nombre.</div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 )}

                                                 {/* STEP 2: PRODUCT PICKER AND CART */}
                                                 {step === 2 && (
                                                        <div className="space-y-10 animate-fade-in">

                                                               {/* Selected Client Info */}
                                                               <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-primary/5">
                                                                      <div className="flex items-center gap-4">
                                                                             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                                                    <User className="w-6 h-6" />
                                                                             </div>
                                                                             <div>
                                                                                    <div className="text-xs font-black uppercase tracking-widest text-primary/60">Cliente Seleccionado</div>
                                                                                    <div className="text-xl font-black tracking-tight">{selectedClient.name}</div>
                                                                             </div>
                                                                      </div>
                                                                      <Button variant="ghost" className="text-[10px] font-black underline opacity-40 hover:opacity-100" onClick={() => setStep(1)}>CAMBIAR</Button>
                                                               </div>

                                                               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                                      {/* Catalog */}
                                                                      <div className="space-y-4">
                                                                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Catálogo Express</h4>
                                                                             <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                                                    {products.map(product => (
                                                                                           <button
                                                                                                  key={product.id}
                                                                                                  onClick={() => addItem(product)}
                                                                                                  className="flex items-center justify-between p-4 bg-muted/10 border border-white/5 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group shadow-inner"
                                                                                           >
                                                                                                  <div className="flex items-center gap-4">
                                                                                                         <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                                                                                                <Box className="w-5 h-5" />
                                                                                                         </div>
                                                                                                         <div className="text-left">
                                                                                                                <div className="font-black text-sm">{product.name}</div>
                                                                                                                <div className="text-[10px] font-black text-muted-foreground">${product.price}</div>
                                                                                                         </div>
                                                                                                  </div>
                                                                                                  <Plus className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all text-emerald-500" />
                                                                                           </button>
                                                                                    ))}
                                                                             </div>
                                                                      </div>

                                                                      {/* Cart */}
                                                                      <div className="space-y-4">
                                                                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/60 ml-2">Items del Pedido</h4>
                                                                             <div className="bg-muted/10 border border-white/5 rounded-3xl p-6 space-y-4 shadow-inner min-h-[200px]">
                                                                                    {orderItems.length === 0 ? (
                                                                                           <div className="h-40 flex flex-col items-center justify-center opacity-20 italic">
                                                                                                  <ShoppingBag className="w-10 h-10 mb-2" />
                                                                                                  <p className="text-xs font-black uppercase tracking-tighter">Sin items aún</p>
                                                                                           </div>
                                                                                    ) : (
                                                                                           orderItems.map(item => (
                                                                                                  <div key={item.productId} className="flex items-center justify-between bg-card p-3 pr-4 rounded-2xl border border-white/5 animate-scale-in">
                                                                                                         <div className="flex items-center gap-3">
                                                                                                                <div className="flex flex-col items-center bg-muted/20 rounded-xl px-2 py-1">
                                                                                                                       <button onClick={() => updateQty(item.productId, 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                                                                                                                       <span className="text-sm font-black">{item.quantity}</span>
                                                                                                                       <button onClick={() => updateQty(item.productId, -1)} className="hover:text-primary"><Minus className="w-3 h-3" /></button>
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                       <div className="text-xs font-black truncate max-w-[100px]">{item.name}</div>
                                                                                                                       <div className="text-[10px] font-bold text-muted-foreground">${(item.quantity * item.unitPrice).toLocaleString()}</div>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                         <button onClick={() => removeItem(item.productId)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                                                                                                                <Trash2 className="w-4 h-4" />
                                                                                                         </button>
                                                                                                  </div>
                                                                                           ))
                                                                                    )}

                                                                                    <div className="pt-4 border-t border-white/5 space-y-4">
                                                                                           <div className="flex justify-between items-center px-2">
                                                                                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Estimado</span>
                                                                                                  <span className="text-3xl font-black tracking-tighter text-primary">${total.toLocaleString()}</span>
                                                                                           </div>

                                                                                           <textarea
                                                                                                  placeholder="Notas adicionales para el chofer..."
                                                                                                  value={notes}
                                                                                                  onChange={(e) => setNotes(e.target.value)}
                                                                                                  className="w-full bg-card border border-white/5 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:italic h-20 resize-none shadow-inner"
                                                                                           />
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 )}
                                          </div>

                                          {/* Modal Footer */}
                                          <div className="p-8 bg-muted/20 border-t border-white/5 flex gap-4">
                                                 {step === 2 && (
                                                        <>
                                                               <Button variant="ghost" className="h-16 flex-1 rounded-2xl font-black uppercase tracking-widest opacity-40 hover:opacity-100" onClick={() => setStep(1)}>
                                                                      VOLVER
                                                               </Button>
                                                               <Button
                                                                      disabled={loading || orderItems.length === 0}
                                                                      onClick={handleSubmit}
                                                                      className="h-16 flex-[2] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-500/20"
                                                               >
                                                                      {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : "CONFIRMAR PEDIDO"}
                                                               </Button>
                                                        </>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
}
