import { prisma } from "@/lib/prisma";
import { Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProductList from "@/components/products/ProductList";
import NewProductButton from "@/components/products/NewProductButton";

export default async function ProductosPage() {
       const products = await prisma.product.findMany({
              orderBy: { name: "asc" }
       });

       return (
              <div className="space-y-12 animate-fade-in-up">
                     {/* Header */}
                     <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Box className="w-5 h-5" />
                                          </div>
                                          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
                                   </div>
                                   <p className="text-muted-foreground font-medium">
                                          Administración de catálogo, listas de precios y control de activos retornables.
                                   </p>
                            </div>
                            <NewProductButton />
                     </header>

                     {/* Stats Quick Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <SmallQuickCard label="Total Items" value={products.length.toString()} />
                            <SmallQuickCard label="Retornables" value={products.filter((p: any) => p.isReturnable).length.toString()} />
                            <SmallQuickCard label="Descartables" value={products.filter((p: any) => !p.isReturnable).length.toString()} />
                     </div>

                     {/* Product List Area */}
                     <section className="pt-8 border-t border-border">
                            <ProductList initialProducts={products} />
                     </section>
              </div>
       );
}

function SmallQuickCard({ label, value }: { label: string, value: string }) {
       return (
              <Card className="p-6 border-border bg-card shadow-sm rounded-2xl">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                     <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
              </Card>
       )
}
