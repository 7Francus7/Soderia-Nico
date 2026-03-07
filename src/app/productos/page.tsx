import { prisma } from "@/lib/prisma";
import { Box } from "lucide-react";
import ProductList from "@/components/products/ProductList";
import NewProductButton from "@/components/products/NewProductButton";

export default async function ProductosPage() {
       const products = await prisma.product.findMany({
              orderBy: { name: "asc" }
       });

       return (
              <div className="page-container space-y-8 lg:space-y-12 text-white">
                     {/* Header */}
                     <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pb-6 border-b border-white/5">
                            <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                 <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Productos</h1>
                                   </div>
                                   <p className="text-sm text-muted-foreground">
                                          Catálogo de productos, precios y activos retornables.
                                   </p>
                            </div>
                            <NewProductButton />
                     </header>

                     {/* Stats - 3 columns */}
                     <div className="grid grid-cols-3 gap-3 sm:gap-5">
                            <SmallQuickCard label="Total" value={products.length.toString()} />
                            <SmallQuickCard label="Retornables" value={products.filter((p: any) => p.isReturnable).length.toString()} />
                            <SmallQuickCard label="Descartables" value={products.filter((p: any) => !p.isReturnable).length.toString()} />
                     </div>

                     {/* Product List */}
                     <section className="pt-6 border-t border-white/5">
                            <ProductList initialProducts={products} />
                     </section>
              </div>
       );
}

function SmallQuickCard({ label, value }: { label: string, value: string }) {
       return (
              <div className="p-4 sm:p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{label}</p>
                     <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</h3>
              </div>
       )
}
