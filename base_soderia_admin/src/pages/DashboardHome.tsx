import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { DollarSign, Truck, AlertTriangle, Users, TrendingUp, TrendingDown, RefreshCw, ShoppingCart, Package, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    sales_today: number;
    pending_deliveries: number;
    pending_orders: number;
    critical_stock_count: number;
    overdue_balance: number;
    debtors_count: number;
    total_clients: number;
    orders_today_count: number;
    sales_change_pct: number;
    pending_change: number;
    sales_history: { date: string, amount: number }[];
}

interface Delivery {
    id: number;
    status: string;
    created_at: string;
    orders_count: number;
    delivered_count: number;
}

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
};

const SkeletonCard = ({ delay = 0 }: { delay?: number }) => (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
        <div className="flex justify-between items-start">
            <div className="flex-1 space-y-3">
                <div className="h-3 skeleton-shimmer rounded-lg w-20" />
                <div className="h-7 skeleton-shimmer rounded-lg w-28" />
            </div>
            <div className="w-11 h-11 skeleton-shimmer rounded-xl" />
        </div>
        <div className="h-4 skeleton-shimmer rounded-lg w-24 mt-4" />
    </div>
);

export default function DashboardHome() {
    const navigate = useNavigate();
    const { username } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsResponse, deliveriesResponse] = await Promise.all([
                api.get('/dashboard/dashboard-stats'),
                api.get('/deliveries/?limit=5')
            ]);
            setStats(statsResponse.data);
            setRecentDeliveries(deliveriesResponse.data);
        } catch (error: any) {
            setError("No se pudieron cargar los datos. Verificá la conexión.");
            setStats({
                sales_today: 0, pending_deliveries: 0, pending_orders: 0,
                critical_stock_count: 0, overdue_balance: 0, debtors_count: 0,
                total_clients: 0, orders_today_count: 0, sales_change_pct: 0,
                pending_change: 0, sales_history: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const safeStats = stats || {
        sales_today: 0, pending_deliveries: 0, pending_orders: 0,
        critical_stock_count: 0, overdue_balance: 0, debtors_count: 0,
        total_clients: 0, orders_today_count: 0, sales_change_pct: 0,
        pending_change: 0, sales_history: []
    } as DashboardStats;

    const cards = [
        {
            title: "Ventas Hoy",
            value: `$${safeStats.sales_today.toLocaleString('es-AR')}`,
            icon: DollarSign,
            gradient: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50",
            iconColor: "text-blue-600",
            change: safeStats.sales_change_pct !== 0 ? `${safeStats.sales_change_pct > 0 ? '+' : ''}${safeStats.sales_change_pct}%` : null,
            trend: safeStats.sales_change_pct >= 0 ? "up" : "down",
            subtext: `${safeStats.orders_today_count} pedido${safeStats.orders_today_count !== 1 ? 's' : ''} hoy`
        },
        {
            title: "Pedidos Pendientes",
            value: safeStats.pending_orders.toString(),
            icon: ShoppingCart,
            gradient: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50",
            iconColor: "text-amber-600",
            subtext: `${safeStats.pending_deliveries} reparto${safeStats.pending_deliveries !== 1 ? 's' : ''} activo${safeStats.pending_deliveries !== 1 ? 's' : ''}`
        },
        {
            title: "Stock Crítico",
            value: `${safeStats.critical_stock_count}`,
            icon: AlertTriangle,
            gradient: "from-red-500 to-rose-500",
            bgLight: "bg-red-50",
            iconColor: "text-red-600",
            badge: safeStats.critical_stock_count > 0 ? "⚠ Reponer" : null,
            subtext: "productos bajo mínimo"
        },
        {
            title: "Deuda Total",
            value: `$${safeStats.overdue_balance?.toLocaleString('es-AR') || '0'}`,
            icon: Users,
            gradient: "from-violet-500 to-purple-500",
            bgLight: "bg-violet-50",
            iconColor: "text-violet-600",
            subtext: `${safeStats.debtors_count} cliente${safeStats.debtors_count !== 1 ? 's' : ''} con deuda`
        }
    ];

    const quickActions = [
        { label: "Nuevo Pedido", icon: ShoppingCart, path: "/orders", gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50 hover:bg-blue-100", text: "text-blue-700", border: "border-blue-100" },
        { label: "Cobrar Deudas", icon: DollarSign, path: "/current-accounts", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 hover:bg-emerald-100", text: "text-emerald-700", border: "border-emerald-100" },
        { label: "Ver Repartos", icon: Truck, path: "/deliveries", gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50 hover:bg-amber-100", text: "text-amber-700", border: "border-amber-100" },
        { label: "Productos", icon: Package, path: "/products", gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50 hover:bg-violet-100", text: "text-violet-700", border: "border-violet-100" },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{username || 'Admin'}</span> 👋
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50 self-end sm:self-auto border border-transparent hover:border-blue-100 group"
                    title="Recargar datos"
                >
                    <RefreshCw className={`w-5 h-5 transition-transform ${loading ? 'animate-spin' : 'group-hover:rotate-45'}`} />
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="flex-1 font-medium">{error}</span>
                    <button onClick={fetchStats} className="text-xs font-bold underline hover:text-red-800 transition">Reintentar</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {loading ? (
                    <>
                        <SkeletonCard delay={0} />
                        <SkeletonCard delay={0.05} />
                        <SkeletonCard delay={0.1} />
                        <SkeletonCard delay={0.15} />
                    </>
                ) : (
                    cards.map((card, idx) => (
                        <div
                            key={idx}
                            className="card-premium p-4 md:p-6 flex flex-col justify-between animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.06}s` }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-slate-500 text-[11px] md:text-xs font-semibold mb-1.5 uppercase tracking-wider truncate">{card.title}</p>
                                    <h3 className="text-lg md:text-2xl font-extrabold text-slate-900 truncate">{card.value}</h3>
                                    {card.subtext && <p className="text-[10px] md:text-xs text-slate-400 mt-1.5 font-medium">{card.subtext}</p>}
                                </div>
                                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 ml-3 shadow-lg`}
                                    style={{ boxShadow: `0 4px 14px rgba(0,0,0,0.1)` }}>
                                    <card.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                            </div>
                            {(card.change || card.badge) && (
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    {card.change && (
                                        <span className={`text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {card.change}
                                        </span>
                                    )}
                                    {card.badge && (
                                        <span className="text-[10px] md:text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full animate-pulse">{card.badge}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Chart and Recent Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center justify-between mb-5 md:mb-6">
                        <h3 className="text-sm md:text-base font-bold text-slate-900">📈 Tendencia de Ventas</h3>
                        <span className="text-[10px] md:text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">Últimos 7 días</span>
                    </div>
                    <div className="h-52 md:h-64">
                        {loading ? (
                            <div className="w-full h-full skeleton-shimmer rounded-xl flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={safeStats.sales_history}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} width={55} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '14px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                        }}
                                        formatter={(value: any) => [`$${Number(value || 0).toLocaleString('es-AR')}`, 'Ventas']}
                                        labelStyle={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Deliveries */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-4">🚚 Repartos Recientes</h3>
                    <div className="space-y-2.5">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                                    <div className="w-10 h-10 skeleton-shimmer rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 skeleton-shimmer rounded-lg w-24" />
                                        <div className="h-2 skeleton-shimmer rounded-lg w-32" />
                                    </div>
                                </div>
                            ))
                        ) : recentDeliveries.length === 0 ? (
                            <div className="empty-state py-8">
                                <div className="empty-state-icon">
                                    <Truck className="w-7 h-7 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">No hay repartos recientes</p>
                                <p className="text-slate-400 text-xs mt-1">Creá un reparto para empezar</p>
                            </div>
                        ) : (
                            recentDeliveries.map((d) => {
                                const isComplete = d.orders_count > 0 && d.delivered_count === d.orders_count;
                                const progress = d.orders_count > 0 ? Math.round((d.delivered_count / d.orders_count) * 100) : 0;
                                return (
                                    <div key={d.id}
                                        className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
                                        onClick={() => navigate('/deliveries')}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                                                <Truck className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-xs md:text-sm truncate">Reparto #{d.id}</p>
                                                <p className="text-[10px] md:text-xs text-slate-400">
                                                    {d.delivered_count}/{d.orders_count} · {new Date(d.created_at).toLocaleDateString('es-AR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isComplete ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                {progress}%
                                            </span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <button
                            onClick={() => navigate('/deliveries')}
                            className="w-full mt-2 text-blue-600 text-sm font-semibold hover:text-blue-700 transition py-2 hover:bg-blue-50 rounded-xl flex items-center justify-center gap-1.5 group"
                        >
                            Ver todos
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-4 md:mb-5">⚡ Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className={`p-4 md:p-5 ${action.bg} border ${action.border} rounded-2xl ${action.text} font-semibold text-xs md:text-sm transition-all text-center flex flex-col items-center gap-2.5 md:gap-3 group active:scale-[0.97] hover:shadow-md`}
                        >
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                style={{ boxShadow: `0 4px 14px rgba(0,0,0,0.12)` }}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
