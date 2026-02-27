"use strict";
"use client";

import { useState } from "react";
import { Search, Package, Tag, Edit, Trash2, Droplets, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";

export default function ProductList({ initialProducts }: { initialProducts: any[] }) {
       const [search, setSearch] = useState("");

       const filtered = initialProducts.filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.code.toLowerCase().includes(search.toLowerCase())
       );

       const handleDelete = async (id: number) => {
              if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
              const result = await deleteProduct(id);
              if (result.success) toast.success("Producto eliminado");
              else toast.error("Error: " + result.error);
       };

       return (
              <div className="space-y-8">
                     {/* Search */}
                     <div className="relative group max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                   type="text"
                                   placeholder="Buscar por nombre o código..."
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="w-full bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl h-14 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
                            />
                     </div>

                     {/* Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.length === 0 ? (
                                   <div className="col-span-full py-20 text-center bg-card/40 border border-white/10 rounded-[2.5rem] glass-card opacity-50">
                                          No se encontraron productos.
                                   </div>
                            ) : (
                                   filtered.map((product, idx) => (
                                          <Card
                                                 key={product.id}
                                                 className="group overflow-hidden rounded-[2.5rem] border border-white/5 bg-card hover:border-primary/20 transition-all hover:scale-[1.02] animate-fade-in-up shadow-2xl shadow-black/5"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="p-8 pb-4">
                                                        <div className="flex justify-between items-start mb-6">
                                                               <div className="space-y-1">
                                                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                                             {product.code}
                                                                      </span>
                                                                      <h3 className="text-2xl font-black tracking-tight pt-2 group-hover:text-primary transition-colors">
                                                                             {product.name}
                                                                      </h3>
                                                               </div>
                                                               {product.isReturnable ? (
                                                                      <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0" title="Retornable">
                                                                             <Droplets className="w-6 h-6" />
                                                                      </div>
                                                               ) : (
                                                                      <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center shrink-0" title="Descartable">
                                                                             <FlaskConical className="w-6 h-6" />
                                                                      </div>
                                                               )}
                                                        </div>

                                                        <div className="text-4xl font-black tracking-tighter mb-6">
                                                               ${product.price.toLocaleString()}
                                                        </div>
                                                 </div>

                                                 <div className="px-8 pb-8 flex items-center justify-between border-t border-white/5 pt-6 bg-muted/5">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                                                               {product.isReturnable ? "Sujeto a devolución" : "Envase descartable"}
                                                        </span>
                                                        <div className="flex gap-2">
                                                               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5">
                                                                      <Edit className="w-5 h-5" />
                                                               </Button>
                                                               <Button
                                                                      variant="ghost"
                                                                      size="icon"
                                                                      onClick={() => handleDelete(product.id)}
                                                                      className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500"
                                                               >
                                                                      <Trash2 className="w-5 h-5" />
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </Card>
                                   ))
                            )}
                     </div>
              </div>
       );
}
