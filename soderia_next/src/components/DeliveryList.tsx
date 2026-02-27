"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Calendar, Clock, CheckCircle, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteDelivery } from "@/actions/deliveries";
import { toast } from "sonner";

interface Delivery {
       id: number;
       createdAt: Date;
       status: string;
       notes: string | null;
       ordersCount: number;
       deliveredCount: number;
}

export default function DeliveryList({ initialDeliveries }: { initialDeliveries: any[] }) {
       const [deliveries, setDeliveries] = useState(initialDeliveries);

       const handleDelete = async (id: number) => {
              if (!confirm("¿Eliminar este reparto? Los pedidos volverán a estar pendientes.")) return;

              const result = await deleteDelivery(id);
              if (result.success) {
                     setDeliveries(prev => prev.filter(d => d.id !== id));
                     toast.success("Reparto eliminado");
              } else {
                     toast.error("Error al eliminar: " + result.error);
              }
       };

       if (deliveries.length === 0) {
              return (
                     <div className="flex flex-col items-center justify-center py-20 bg-card/40 border border-white/10 rounded-[2.5rem] glass-card">
                            <div className="w-20 h-20 bg-muted/20 rounded-3xl flex items-center justify-center text-muted-foreground mb-6">
                                   <Truck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No hay repartos</h3>
                            <p className="text-muted-foreground mb-8">Crea uno nuevo para empezar la distribución.</p>
                            <Button variant="outline">Ver Pedidos Pendientes</Button>
                     </div>
              );
       }

       return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {deliveries.map((delivery, index) => (
                            <DeliveryCard
                                   key={delivery.id}
                                   delivery={delivery}
                                   onDelete={() => handleDelete(delivery.id)}
                                   delay={index * 0.05}
                            />
                     ))}
              </div>
       );
}

function DeliveryCard({ delivery, onDelete, delay }: { delivery: any, onDelete: () => void, delay: number }) {
       const isCompleted = delivery.deliveredCount === delivery.ordersCount && delivery.ordersCount > 0;
       const progress = delivery.ordersCount > 0 ? (delivery.deliveredCount / delivery.ordersCount) * 100 : 0;

       return (
              <Card
                     className="group hover:scale-[1.02] transition-all animate-fade-in-up"
                     style={{ animationDelay: `${delay}s` }}
              >
                     <CardContent className="p-0">
                            <div className="p-6 pb-2 flex justify-between items-start">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                                 <span className="font-mono text-sm font-bold text-muted-foreground">#{delivery.id}</span>
                                                 <StatusBadge status={isCompleted ? "COMPLETED" : "PENDING"} />
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                                                 <Calendar className="w-3.5 h-3.5" />
                                                 {new Date(delivery.createdAt).toLocaleDateString()}
                                          </div>
                                   </div>

                                   <Button
                                          variant="ghost"
                                          size="icon"
                                          className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                          onClick={onDelete}
                                   >
                                          <Trash2 className="w-5 h-5" />
                                   </Button>
                            </div>

                            <div className="px-6 py-4">
                                   <div className="flex justify-between items-end mb-3 font-black">
                                          <span className="text-3xl tracking-tight">
                                                 {delivery.deliveredCount}<span className="text-muted-foreground text-xl">/{delivery.ordersCount}</span>
                                          </span>
                                          <span className={cn(
                                                 "text-sm tracking-widest",
                                                 isCompleted ? "text-emerald-500" : "text-primary"
                                          )}>
                                                 {Math.round(progress)}%
                                          </span>
                                   </div>
                                   <div className="h-4 w-full bg-muted/30 rounded-full overflow-hidden p-1 border border-white/5">
                                          <div
                                                 className={cn(
                                                        "h-full rounded-full transition-all duration-1000 ease-out",
                                                        isCompleted
                                                               ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                               : "bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                                                 )}
                                                 style={{ width: `${progress}%` }}
                                          />
                                   </div>
                            </div>

                            <div className="p-4 bg-muted/10 mt-2 flex gap-3">
                                   <Button className="flex-1 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black tracking-widest text-xs uppercase h-11">
                                          <Eye className="w-4 h-4 mr-2" />
                                          Ver Hoja de Ruta
                                   </Button>
                            </div>
                     </CardContent>
              </Card>
       );
}

function StatusBadge({ status }: { status: string }) {
       const isCompleted = status === "COMPLETED";
       return (
              <div className={cn(
                     "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                     isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
              )}>
                     {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                     {isCompleted ? "Completado" : "En Curso"}
              </div>
       );
}
