"use client";

import { useState } from "react";
import { Plus, X, Box, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDelivery } from "@/actions/deliveries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewDeliveryButton({ pendingOrdersCount, availableOrders }: { pendingOrdersCount: number, availableOrders: any[] }) {
       const [isOpen, setIsOpen] = useState(false);
       const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
       const [loading, setLoading] = useState(false);

       const handleCreate = async () => {
              if (selectedOrders.length === 0) return;
              setLoading(true);
              const result = await createDelivery(selectedOrders);
              if (result.success) {
                     toast.success("Reparto creado exitosamente");
                     setIsOpen(false);
                     setSelectedOrders([]);
              } else {
                     toast.error("Error: " + result.error);
              }
              setLoading(false);
       };

       const toggleOrder = (id: number) => {
              setSelectedOrders(prev =>
                     prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
              );
       };

       return (
              <>
                     <Button
                            onClick={() => setIsOpen(true)}
                            className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-white hover:bg-white/90 text-black font-black tracking-widest border-none shadow-lg transition-all hover:scale-105 active:scale-95"
                     >
                            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                            NUEVO REPARTO
                            {pendingOrdersCount > 0 && (
                                   <span className="ml-2 bg-black/10 px-2 py-0.5 rounded-full text-[10px] font-black">
                                          {pendingOrdersCount}
                                   </span>
                            )}
                     </Button>

                     {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                                   <div className="bg-card w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-slide-in-up">

                                          {/* Modal Header */}
                                          <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
                                                 <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                               <Truck className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                               <h3 className="text-2xl font-black tracking-tight uppercase italic">Armar Reparto</h3>
                                                               <p className="text-sm text-muted-foreground font-medium italic opacity-60">Seleccioná los pedidos para la hoja de ruta.</p>
                                                        </div>
                                                 </div>
                                                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-2xl hover:bg-white/5">
                                                        <X className="w-6 h-6" />
                                                 </Button>
                                          </div>

                                          {/* Modal Content */}
                                          <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                                                 {availableOrders.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-20 opacity-30 italic">
                                                               <Box className="w-12 h-12 mb-4" />
                                                               <p className="font-bold uppercase tracking-widest text-sm">No hay pedidos pendientes</p>
                                                        </div>
                                                 ) : (
                                                        availableOrders.map(order => (
                                                               <button
                                                                      key={order.id}
                                                                      onClick={() => toggleOrder(order.id)}
                                                                      className={cn(
                                                                             "w-full flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all text-left group active:scale-[0.98]",
                                                                             selectedOrders.includes(order.id)
                                                                                    ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                                                      )}
                                                               >
                                                                      <div className={cn(
                                                                             "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                                             selectedOrders.includes(order.id)
                                                                                    ? "bg-white border-white text-black"
                                                                                    : "border-white/20"
                                                                      )}>
                                                                             {selectedOrders.includes(order.id) && <Plus className="w-4 h-4 font-black" />}
                                                                      </div>

                                                                      <div className="flex-1">
                                                                             <div className="flex justify-between items-center mb-1">
                                                                                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/40">Pedido #{order.id}</span>
                                                                                    <span className="font-black text-xl text-white">${order.totalAmount.toLocaleString()}</span>
                                                                             </div>
                                                                             <div className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                                                                                    {order.client.name}
                                                                             </div>
                                                                             <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium truncate mt-1">
                                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                                    {order.client.address}
                                                                             </div>
                                                                      </div>
                                                               </button>
                                                        ))
                                                 )}
                                          </div>

                                          {/* Modal Footer */}
                                          <div className="p-8 pt-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                                 <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                                        {selectedOrders.length} pedido{selectedOrders.length !== 1 ? 's' : ''} seleccionado{selectedOrders.length !== 1 ? 's' : ''}
                                                 </div>
                                                 <div className="flex gap-3 w-full sm:w-auto">
                                                        <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-none rounded-xl font-bold">Cancelar</Button>
                                                        <Button
                                                               disabled={selectedOrders.length === 0 || loading}
                                                               onClick={handleCreate}
                                                               className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-white hover:bg-white/90 text-black font-black tracking-widest border-none shadow-lg transition-all active:scale-95 disabled:bg-white/10 disabled:text-white/20"
                                                        >
                                                               {loading ? "Creando..." : `Confirmar Reparto (${selectedOrders.length})`}
                                                        </Button>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     )}
              </>
       );
}
