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
                     <Card className="p-12 border-white/5 bg-card/40 flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                            <p className="mt-4 text-xs font-black uppercase tracking-widest opacity-20 italic">Procesando Métricas...</p>
                     </Card>
              );
       }

       return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                     {/* Sales Chart */}
                     <Card className="p-6 lg:p-10 border-white/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden group shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                   <div>
                                          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Rendimiento Semanal</p>
                                          <h3 className="text-2xl lg:text-3xl font-black italic">Ventas <span className="text-primary">Netas</span></h3>
                                   </div>
                                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl">
                                          <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" />
                                   </div>
                            </div>

                            <div className="h-[250px] lg:h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={data}>
                                                 <defs>
                                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                               <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                                               <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                                        </linearGradient>
                                                 </defs>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                 <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold' }}
                                                        tickFormatter={(str) => str.split('-')[2]}
                                                 />
                                                 <YAxis hide />
                                                 <Tooltip
                                                        contentStyle={{ backgroundColor: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)' }}
                                                        itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                                 />
                                                 <Area
                                                        type="monotone"
                                                        dataKey="sales"
                                                        stroke="#7c3aed"
                                                        strokeWidth={4}
                                                        fillOpacity={1}
                                                        fill="url(#colorSales)"
                                                 />
                                          </AreaChart>
                                   </ResponsiveContainer>
                            </div>
                     </Card>

                     {/* Collections Chart */}
                     <Card className="p-6 lg:p-10 border-white/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden group shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                   <div>
                                          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Flujo de Caja</p>
                                          <h3 className="text-2xl lg:text-3xl font-black italic">Cobranzas <span className="text-emerald-500">Efectivas</span></h3>
                                   </div>
                                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl">
                                          <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />
                                   </div>
                            </div>

                            <div className="h-[250px] lg:h-[300px] w-full">
                                   <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={data}>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                 <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold' }}
                                                        tickFormatter={(str) => str.split('-')[2]}
                                                 />
                                                 <YAxis hide />
                                                 <Tooltip
                                                        contentStyle={{ backgroundColor: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)' }}
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                 />
                                                 <Bar
                                                        dataKey="collections"
                                                        fill="#10b981"
                                                        radius={[10, 10, 0, 0]}
                                                        barSize={30}
                                                 />
                                          </BarChart>
                                   </ResponsiveContainer>
                            </div>
                     </Card>
              </div>
       );
}
