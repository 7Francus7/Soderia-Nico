import { prisma } from "@/lib/prisma";
import { Users, Plus, Search, Filter, Phone, MapPin, ChevronRight, UserPlus, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import ClientList from "@/components/ClientList";
import NewClientButton from "@/components/NewClientButton";

export default async function ClientesPage({
       searchParams,
}: {
       searchParams: { q?: string; sort?: string };
}) {
       const search = searchParams.q || "";
       const sort = searchParams.sort === "debt";

       const clients = await prisma.client.findMany({
              where: search ? {
                     OR: [
                            { name: { contains: search } },
                            { address: { contains: search } },
                     ]
              } : {},
              orderBy: sort ? { balance: "desc" } : { name: "asc" },
       });

       // Calculate metrics
       const totalClients = await prisma.client.count();
       const totalDebt = await prisma.client.aggregate({
              _sum: { balance: true }
       });
       const clientsWithDebt = await prisma.client.count({
              where: { balance: { gt: 0 } }
       });

       return (
              <div className="min-h-screen bg-background p-6 lg:p-10">
                     {/* Background blobs */}
                     <div className="fixed top-[-5%] left-[-5%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                     <div className="fixed bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

                     <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                   <div className="space-y-1">
                                          <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                                        <Users className="w-6 h-6" />
                                                 </div>
                                                 <h1 className="text-4xl font-black tracking-tight">Clientes</h1>
                                          </div>
                                          <p className="text-muted-foreground font-medium text-lg">
                                                 Cartera de clientes, estados de cuenta y saldos de envases.
                                          </p>
                                   </div>

                                   <div className="flex items-center gap-3 w-full md:w-auto">
                                          <NewClientButton />
                                   </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
                                          <div className="absolute top-0 right-0 p-4 opacity-10">
                                                 <Users className="w-20 h-20" />
                                          </div>
                                          <CardContent className="p-8">
                                                 <p className="text-sm font-black uppercase tracking-widest text-primary/60 mb-1">Total Clientes</p>
                                                 <h3 className="text-4xl font-black">{totalClients}</h3>
                                          </CardContent>
                                   </Card>

                                   <Card className="bg-rose-500/5 border-rose-500/10 overflow-hidden relative">
                                          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
                                                 <TrendingUp className="w-20 h-20" />
                                          </div>
                                          <CardContent className="p-8">
                                                 <p className="text-sm font-black uppercase tracking-widest text-rose-500/60 mb-1">Deuda Total</p>
                                                 <h3 className="text-4xl font-black text-rose-500">${totalDebt._sum.balance?.toLocaleString() || 0}</h3>
                                          </CardContent>
                                   </Card>

                                   <Card className="bg-amber-500/5 border-amber-500/10 overflow-hidden relative">
                                          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
                                                 <AlertCircle className="w-20 h-20" />
                                          </div>
                                          <CardContent className="p-8">
                                                 <p className="text-sm font-black uppercase tracking-widest text-amber-500/60 mb-1">Clientes con Deuda</p>
                                                 <h3 className="text-4xl font-black text-amber-500">{clientsWithDebt}</h3>
                                          </CardContent>
                                   </Card>
                            </div>

                            {/* Client List */}
                            <ClientList initialClients={clients} />
                     </div>
              </div>
       );
}
