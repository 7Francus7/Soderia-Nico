"use strict";
"use client";

import { useEffect, useState } from "react";
import {
       BarChart,
       Bar,
       XAxis,
       YAxis,
       CartesianGrid,
       Tooltip,
       ResponsiveContainer,
       AreaChart,
       Area
} from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { getDashboardStats } from "@/actions/analytics";

export default function AnalyticsDashboard() {
       const [data, setData] = useState<any[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              async function load() {
                     const res = await getDashboardStats();
                     if (res.success && res.data) setData(res.data);
                     setLoading(false);
              }
              load();
       }, []);

       if (loading) {
              return (
                     <Card className="p-12 border-border bg-muted/20 flex flex-col items-center justify-center min-h-[400px] rounded-2xl">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60">Sincronizando Métricas</p>
                     </Card>
              );
       }

       return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Sales Chart */}
                     <Card className="p-8 border-border bg-card rounded-2xl shadow-sm overflow-hidden group">
                            <div className="flex justify-between items-start mb-10">
                                   <div>
                                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Volumen de Ventas</p>
                                          <h3 className="text-2xl font-semibold tracking-tight">Relleno Semanal</h3>
                                   </div>
                                   <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                                          <TrendingUp className="w-5 h-5" />
                                   </div>
                            </div>

                            <div className="h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={data}>
                                                 <defs>
                                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                               <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                                               <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                                        </linearGradient>
                                                 </defs>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                                 <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                                        tickFormatter={(str) => str.split('-')[2]}
                                                 />
                                                 <YAxis hide />
                                                 <Tooltip
                                                        contentStyle={{
                                                               backgroundColor: 'hsl(var(--card))',
                                                               border: '1px solid hsl(var(--border))',
                                                               borderRadius: '12px',
                                                               boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                                        }}
                                                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, fontSize: '13px' }}
                                                 />
                                                 <Area
                                                        type="monotone"
                                                        dataKey="sales"
                                                        stroke="var(--primary)"
                                                        strokeWidth={2.5}
                                                        fillOpacity={1}
                                                        fill="url(#colorSales)"
                                                 />
                                          </AreaChart>
                                   </ResponsiveContainer>
                            </div>
                     </Card>

                     {/* Collections Chart */}
                     <Card className="p-8 border-border bg-card rounded-2xl shadow-sm overflow-hidden group">
                            <div className="flex justify-between items-start mb-10">
                                   <div>
                                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Flujo Monedero</p>
                                          <h3 className="text-2xl font-semibold tracking-tight">Cobranzas Directas</h3>
                                   </div>
                                   <div className="w-10 h-10 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-500/10">
                                          <DollarSign className="w-5 h-5" />
                                   </div>
                            </div>

                            <div className="h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={data}>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                                 <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                                        tickFormatter={(str) => str.split('-')[2]}
                                                 />
                                                 <YAxis hide />
                                                 <Tooltip
                                                        contentStyle={{
                                                               backgroundColor: 'hsl(var(--card))',
                                                               border: '1px solid hsl(var(--border))',
                                                               borderRadius: '12px',
                                                               boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                                        }}
                                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                                 />
                                                 <Bar
                                                        dataKey="collections"
                                                        fill="hsl(var(--primary))"
                                                        radius={[4, 4, 0, 0]}
                                                        barSize={24}
                                                 />
                                          </BarChart>
                                   </ResponsiveContainer>
                            </div>
                     </Card>
              </div>
       );
}
