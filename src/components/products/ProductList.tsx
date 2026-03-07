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
              <div className="space-y-4">
                     {/* Search */}
                     <div className="flex items-center gap-2 max-w-sm">
                            <div className="relative group flex-1">
                                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                   <input
                                          type="text"
                                          placeholder="Buscar productos..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 shadow-sm"
                                   />
                            </div>
                            <div className="px-3 h-11 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{filtered.length}</span>
                            </div>
                     </div>

                     {/* Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.length === 0 ? (
                                   <div className="col-span-full py-16 text-center bg-white border border-dashed border-border rounded-xl">
                                          <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                                          <p className="font-semibold text-muted-foreground/40 text-sm italic">No hay productos disponibles</p>
                                   </div>
                            ) : (
                                   filtered.map((product, idx) => (
                                          <Card
                                                 key={product.id}
                                                 className="group overflow-hidden rounded-xl border border-border bg-white hover:border-primary/40 transition-all card-shadow hover:card-shadow-md animate-fade-in-up"
                                                 style={{ animationDelay: `${idx * 0.05}s` }}
                                          >
                                                 <div className="p-5">
                                                        <div className="flex justify-between items-start mb-4">
                                                               <div className="space-y-1">
                                                                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                                                             {product.code}
                                                                      </span>
                                                                      <h3 className="text-base font-bold text-foreground leading-tight pt-1">
                                                                             {product.name}
                                                                      </h3>
                                                               </div>
                                                               {product.isReturnable ? (
                                                                      <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0 border border-amber-100" title="Retornable">
                                                                             <Droplets className="w-4 h-4" />
                                                                      </div>
                                                               ) : (
                                                                      <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0 border border-blue-100" title="Descartable">
                                                                             <FlaskConical className="w-4 h-4" />
                                                                      </div>
                                                               )}
                                                        </div>

                                                        <div className="text-2xl font-bold text-foreground tracking-tight mb-4 tabular-nums">
                                                               <span className="text-xs text-muted-foreground font-medium mr-0.5 opacity-50">$</span>{product.price.toLocaleString()}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                                               <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 italic">
                                                                      {product.isReturnable ? "Sujeto a devolución" : "Envase descartable"}
                                                               </span>
                                                               <div className="flex gap-1.5">
                                                                      <button className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all active:scale-95">
                                                                             <Edit className="w-3.5 h-3.5" />
                                                                      </button>
                                                                      <button
                                                                             onClick={() => handleDelete(product.id)}
                                                                             className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all active:scale-95"
                                                                      >
                                                                             <Trash2 className="w-3.5 h-3.5" />
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </Card>
                                   ))
                            )}
                     </div>
              </div>
       );
}
