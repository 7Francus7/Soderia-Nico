import { prisma } from "@/lib/prisma";
import { Box, TrendingUp, Package, Layers, Plus, Filter, ChevronRight, Droplet, FlaskConical } from "lucide-react";
import ProductList from "@/components/products/ProductList";
import NewProductButton from "@/components/products/NewProductButton";
import { cn } from "@/lib/utils";

export default async function ProductosPage() {
       const products = await prisma.product.findMany({
              orderBy: { name: "asc" }
       });

       return (
              <div className="flex flex-col min-h-screen bg-white animate-fade-in pb-32">
                     {/* iOS PREMIUM HEADER */}
                     <header className="px-6 pt-12 pb-10 sm:px-10 lg:px-16 flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-1.5 opacity-40 mb-1 px-1">
                                                 <Layers className="w-3.5 h-3.5" />
                                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestión de Stock</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                                 <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground leading-tight">Productos</h1>
                                          </div>
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1 opacity-60">
                                                 Catálogo maestro de activos y consumibles
                                          </p>
                                   </div>
                                   <div className="w-full sm:w-auto">
                                          <NewProductButton />
                                   </div>
                            </div>
                     </header>

                     <main className="px-6 sm:px-10 lg:px-16 space-y-12">
                            {/* STATS - 3 columns premium cards */}
                            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                   <MetricProductCard
                                          label="Total Catálogo"
                                          value={products.length.toString()}
                                          icon={Package}
                                          color="primary"
                                   />
                                   <MetricProductCard
                                          label="Retornables"
                                          value={products.filter((p: any) => p.isReturnable).length.toString()}
                                          icon={Droplet}
                                          color="amber"
                                   />
                                   <MetricProductCard
                                          label="Descartables"
                                          value={products.filter((p: any) => !p.isReturnable).length.toString()}
                                          icon={FlaskConical}
                                          color="blue"
                                   />
                            </section>

                            {/* PRODUCT LIST SECTION */}
                            <section className="pt-8 space-y-8">
                                   <div className="flex items-center gap-4 px-2">
                                          <Filter className="w-4 h-4 text-primary opacity-40" />
                                          <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.15em]">Filtrado Maestro</h3>
                                          <div className="h-px flex-1 bg-slate-50" />
                                   </div>
                                   <ProductList initialProducts={products} />
                            </section>
                     </main>
              </div>
       );
}

function MetricProductCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: "primary" | "amber" | "blue" }) {
       const colors = {
              primary: "bg-primary/5 text-primary border-primary/10 shadow-primary/5",
              amber: "bg-amber-50 text-amber-500 border-amber-100 shadow-amber-500/5",
              blue: "bg-indigo-50 text-indigo-500 border-indigo-100 shadow-indigo-500/5"
       };

       return (
              <div className="group p-10 rounded-[2.5rem] border-2 border-slate-50 bg-white flex flex-col transition-all duration-300 shadow-2xl shadow-slate-200/40 hover:scale-[1.02] hover:shadow-slate-300/40">
                     <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-300">{label}</p>
                            <div className={cn(
                                   "w-14 h-14 rounded-[1.4rem] flex items-center justify-center transition-transform group-hover:rotate-12",
                                   colors[color]
                            )}>
                                   <Icon className="w-7 h-7 stroke-[2.5px]" />
                            </div>
                     </div>
                     <div className="flex items-baseline gap-2">
                            <h3 className="text-5xl font-black tracking-tighter tabular-nums leading-none text-foreground">
                                   {value}
                            </h3>
                            <span className="text-sm font-black text-slate-200 uppercase tracking-widest">UD.</span>
                     </div>
              </div>
       )
}
