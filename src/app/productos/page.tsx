import { prisma } from "@/lib/prisma";
import { Box, Plus, Search, Package, Tag, Filter, Edit, Trash2, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductList from "@/components/ProductList";
import NewProductButton from "@/components/NewProductButton";

export default async function ProductosPage() {
       const products = await prisma.product.findMany({
              orderBy: { name: "asc" }
       });

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10">
                     <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                                                        <Box className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight">Productos</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Catálogo de precios y gestión de envases retornables.
                                          </p>
                                   </div>

                                   <NewProductButton />
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <Card className="bg-primary/5 border-primary/10 p-8">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Total Productos</span>
                                          <h3 className="text-4xl font-black">{products.length}</h3>
                                   </Card>
                                   <Card className="bg-emerald-500/5 border-emerald-500/10 p-8">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Retornables</span>
                                          <h3 className="text-4xl font-black">{products.filter((p: any) => p.isReturnable).length}</h3>
                                   </Card>
                                   <Card className="bg-amber-500/5 border-amber-500/10 p-8">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Descartables</span>
                                          <h3 className="text-4xl font-black">{products.filter((p: any) => !p.isReturnable).length}</h3>
                                   </Card>
                            </div>

                            {/* Product List */}
                            <ProductList initialProducts={products} />
                     </div>
              </div>
       );
}
