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
import { Card } from "@/components/ui/card";

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
              toast.success(`${product.name} añadido`);
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

       const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase()));
       const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

       return (
              <>
                     <Button onClick={() => setIsOpen(true)} className="gap-2 rounded-xl h-12 px-6 shadow-sm">
                            <Plus className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Nuevo Pedido</span>
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
                                   <div className="bg-card w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">

                                          {/* Header */}
                                          <div className="px-8 py-6 flex justify-between items-center border-b border-border">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                                               <ShoppingBag className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-xl font-bold tracking-tight">Registro de Pedido</h3>
                                                               <div className="flex items-center gap-2 mt-0.5">
                                                                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === 1 ? "text-primary" : "text-muted-foreground opacity-40")}>Cliente</span>
                                                                      <div className="w-1 h-1 rounded-full bg-border" />
                                                                      <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === 2 ? "text-primary" : "text-muted-foreground opacity-40")}>Productos</span>
                                                               </div>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); reset(); }} className="rounded-xl h-10 w-10">
                                                        <X className="w-5 h-5" />
                                                 </Button>
                                          </div>

                                          {/* Body */}
                                          <div className="flex-1 overflow-y-auto p-6 lg:p-8">

                                                 {/* STEP 1 */}
                                                 {step === 1 && (
                                                        <div className="space-y-6">
                                                               <div className="relative">
                                                                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                                                                      <input
                                                                             type="text"
                                                                             placeholder="Buscar cliente por nombre o calle..."
                                                                             autoFocus
                                                                             value={search}
                                                                             onChange={(e) => setSearch(e.target.value)}
                                                                             className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                                                                      />
                                                               </div>

                                                               <div className="space-y-2">
                                                                      {filteredClients.slice(0, 8).map(client => (
                                                                             <button
                                                                                    key={client.id}
                                                                                    onClick={() => { setSelectedClient(client); setStep(2); setSearch(""); }}
                                                                                    className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all group text-left"
                                                                             >
                                                                                    <div className="flex items-center gap-4">
                                                                                           <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                                                                  <User className="w-5 h-5" />
                                                                                           </div>
                                                                                           <div>
                                                                                                  <div className="font-bold text-sm">{client.name}</div>
                                                                                                  <div className="text-[11px] font-medium text-muted-foreground uppercase opacity-60 tracking-tight">{client.address}</div>
                                                                                           </div>
                                                                                    </div>
                                                                                    <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                                             </button>
                                                                      ))}
                                                                      {search && filteredClients.length === 0 && (
                                                                             <div className="text-center py-8 text-sm text-muted-foreground italic">No se encontraron clientes.</div>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 )}

                                                 {/* STEP 2 */}
                                                 {step === 2 && (
                                                        <div className="space-y-8">
                                                               <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                                                                      <div className="flex items-center gap-3">
                                                                             <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                                                    <User className="w-4 h-4" />
                                                                             </div>
                                                                             <div>
                                                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pedido para</p>
                                                                                    <p className="font-bold text-sm tracking-tight">{selectedClient.name}</p>
                                                                             </div>
                                                                      </div>
                                                                      <Button variant="ghost" size="sm" className="text-[10px] font-bold h-7" onClick={() => setStep(1)}>CAMBIAR</Button>
                                                               </div>

                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                      {/* Catalog */}
                                                                      <div className="space-y-4">
                                                                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Productos</p>
                                                                             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                                                                    {products.map(product => (
                                                                                           <button
                                                                                                  key={product.id}
                                                                                                  onClick={() => addItem(product)}
                                                                                                  className="w-full flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl hover:border-primary/40 transition-all group"
                                                                                           >
                                                                                                  <div className="flex items-center gap-3">
                                                                                                         <div className="w-8 h-8 bg-card rounded flex items-center justify-center text-muted-foreground">
                                                                                                                <Box className="w-4 h-4" />
                                                                                                         </div>
                                                                                                         <div className="text-left">
                                                                                                                <div className="font-bold text-xs">{product.name}</div>
                                                                                                                <div className="text-[10px] font-bold text-muted-foreground">${product.price}</div>
                                                                                                         </div>
                                                                                                  </div>
                                                                                                  <Plus className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100" />
                                                                                           </button>
                                                                                    ))}
                                                                             </div>
                                                                      </div>

                                                                      {/* Cart */}
                                                                      <div className="space-y-4">
                                                                             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Detalle</p>
                                                                             <div className="bg-muted/30 border border-border p-4 rounded-xl min-h-[150px] space-y-3">
                                                                                    {orderItems.length === 0 ? (
                                                                                           <div className="h-32 flex flex-col items-center justify-center text-muted-foreground opacity-40 text-[10px] font-bold uppercase tracking-widest">Carrito Vacío</div>
                                                                                    ) : (
                                                                                           orderItems.map(item => (
                                                                                                  <div key={item.productId} className="flex items-center justify-between bg-card p-2 px-3 rounded-lg border border-border">
                                                                                                         <div className="flex flex-col">
                                                                                                                <span className="text-[11px] font-bold truncate max-w-[100px]">{item.name}</span>
                                                                                                                <span className="text-[10px] font-medium text-muted-foreground">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                                                                         </div>
                                                                                                         <div className="flex items-center gap-2">
                                                                                                                <button onClick={() => updateQty(item.productId, -1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-border transition-colors"><Minus className="w-3 h-3" /></button>
                                                                                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                                                                                <button onClick={() => updateQty(item.productId, 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-border transition-colors"><Plus className="w-3 h-3" /></button>
                                                                                                         </div>
                                                                                                  </div>
                                                                                           ))
                                                                                    )}
                                                                                    <div className="mt-4 pt-3 border-t border-border flex justify-between items-end">
                                                                                           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                                                                                           <span className="text-2xl font-bold tracking-tighter">${total.toLocaleString()}</span>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </div>

                                                               <textarea
                                                                      placeholder="Notas u observaciones para el chofer..."
                                                                      value={notes}
                                                                      onChange={(e) => setNotes(e.target.value)}
                                                                      className="w-full h-20 bg-muted/20 border border-border rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                                                               />
                                                        </div>
                                                 )}
                                          </div>

                                          {/* Footer */}
                                          <div className="p-6 bg-muted/10 border-t border-border flex gap-3">
                                                 <Button variant="ghost" className="flex-1 rounded-xl h-12 text-xs font-bold uppercase tracking-widest" onClick={() => { setIsOpen(false); reset(); }}>
                                                        Cancelar
                                                 </Button>
                                                 {step === 2 && (
                                                        <Button
                                                               disabled={loading || orderItems.length === 0}
                                                               onClick={handleSubmit}
                                                               className="flex-[2] rounded-xl h-12 text-xs font-bold uppercase tracking-widest"
                                                        >
                                                               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Pedido"}
                                                        </Button>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
}
