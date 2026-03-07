import { prisma } from "@/lib/prisma";
import { Box, Package, Layers, Droplet, FlaskConical, TrendingUp } from "lucide-react";
import ProductList from "@/components/products/ProductList";
import NewProductButton from "@/components/products/NewProductButton";
import { cn } from "@/lib/utils";

export default async function ProductosPage() {
       const products = await prisma.product.findMany({
              orderBy: { name: "asc" }
       });

       return (
              <div className="flex flex-col min-h-screen bg-background text-foreground animate-fade-in pb-32">

                     {/* GOOGLE PROFESSIONAL HEADER AREA */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                   <div className="space-y-2">
                                          <div className="flex items-center gap-2 mb-1">
                                                 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                        <Layers className="w-4 h-4" />
                                                 </div>
                                                 <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gestión de Stock</span>
                                          </div>
                                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                                 Catálogo de Productos
                                          </h1>
                                          <p className="text-sm font-medium text-muted-foreground max-w-2xl">
                                                 Administra activos retornables, envases y consumibles de la sodería.
                                          </p>
                                   </div>

                                   <div className="w-full sm:w-auto">
                                          <NewProductButton />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">
                            {/* STATS AREA */}
                            <section className="space-y-6">
                                   <div className="flex items-center gap-2 px-1">
                                          <div className="w-2 h-2 rounded-full bg-primary" />
                                          <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Estado del Catálogo</h3>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                          <MetricProductCard
                                                 label="Total Catálogo"
                                                 value={products.length.toString()}
                                                 icon={Package}
                                                 color="blue"
                                                 subtitle="Variedades activas"
                                          />
                                          <MetricProductCard
                                                 label="Retornables"
                                                 value={products.filter((p: any) => p.isReturnable).length.toString()}
                                                 icon={Droplet}
                                                 color="amber"
                                                 subtitle="Envases con stock"
                                          />
                                          <MetricProductCard
                                                 label="Descartables"
                                                 value={products.filter((p: any) => !p.isReturnable).length.toString()}
                                                 icon={FlaskConical}
                                                 color="indigo"
                                                 subtitle="Consumo directo"
                                          />
                                   </div>
                            </section>

                            {/* LIST SECTION */}
                            <section className="space-y-6">
                                   <div className="flex items-center justify-between px-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                                        <Box className="w-5 h-5 stroke-[2px]" />
                                                 </div>
                                                 <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold text-foreground tracking-tight">Inventario Maestro</h3>
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Filtro de Productos</p>
                                                 </div>
                                          </div>
                                          <div className="px-4 py-1.5 bg-secondary border border-border rounded-full flex items-center gap-2 shadow-sm">
                                                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{products.length} PRODUCTOS</span>
                                          </div>
                                   </div>

                                   <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                          <ProductList initialProducts={products} />
                                   </div>
                            </section>
                     </main>

                     {/* REFINED FOOTER */}
                     <footer className="mt-auto px-10 py-12 flex flex-col items-center gap-4 text-[10px] font-bold text-muted-foreground border-t border-border bg-secondary/30 relative overflow-hidden">
                            <div className="flex items-center gap-6">
                                   <span>Sodería Nico App</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Inventory Management v2.5.0</span>
                                   <div className="w-1 h-1 rounded-full bg-border" />
                                   <span>Buenos Aires</span>
                            </div>
                            <p className="opacity-60">Google Professional Interface Upgrade</p>
                     </footer>
              </div>
       );
}

function MetricProductCard({ label, value, icon: Icon, color, subtitle }: { label: string, value: string, icon: any, color: "blue" | "amber" | "indigo", subtitle: string }) {
       const colors = {
              blue: "text-blue-500 bg-blue-50 border-blue-100",
              amber: "text-amber-500 bg-amber-50 border-amber-100",
              indigo: "text-indigo-500 bg-indigo-50 border-indigo-100"
       };

       return (
              <div className="relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col gap-4 overflow-hidden">
                     <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 shadow-sm", colors[color])}>
                                   <Icon className="w-6 h-6 stroke-[2px]" />
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                     </div>

                     <div className="relative z-10 px-0.5">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                            <div className="flex items-baseline gap-2">
                                   <h4 className="text-4xl font-bold tracking-tight text-foreground tabular-nums leading-none">{value}</h4>
                                   <span className="text-xs font-bold text-muted-foreground uppercase">ud.</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-3">
                                   <div className={cn("w-1 h-1 rounded-full bg-primary/40")} />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{subtitle}</span>
                            </div>
                     </div>
              </div>
       )
}
