import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { DollarSign, Truck, AlertTriangle, Users, TrendingUp, TrendingDown, RefreshCw, ShoppingCart, Package } from "lucide-react";
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

// Skeleton block for loading state
const SkeletonCard = () => (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded w-20 mb-3" />
                <div className="h-7 bg-slate-200 rounded w-28" />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-4 bg-slate-100 rounded w-16 mt-4" />
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
                sales_today: 0,
                pending_deliveries: 0,
                pending_orders: 0,
                critical_stock_count: 0,
                overdue_balance: 0,
                debtors_count: 0,
                total_clients: 0,
                orders_today_count: 0,
                sales_change_pct: 0,
                pending_change: 0,
                sales_history: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const safeStats = stats || {
        sales_today: 0,
        pending_deliveries: 0,
        pending_orders: 0,
        critical_stock_count: 0,
        overdue_balance: 0,
        debtors_count: 0,
        total_clients: 0,
        orders_today_count: 0,
        sales_change_pct: 0,
        pending_change: 0,
        sales_history: []
    } as DashboardStats;

    const cards = [
        {
            title: "Ventas Hoy",
            value: `$${safeStats.sales_today.toLocaleString('es-AR')}`,
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: safeStats.sales_change_pct !== 0 ? `${safeStats.sales_change_pct > 0 ? '+' : ''}${safeStats.sales_change_pct}%` : null,
            trend: safeStats.sales_change_pct >= 0 ? "up" : "down",
            subtext: `${safeStats.orders_today_count} pedido${safeStats.orders_today_count !== 1 ? 's' : ''} hoy`
        },
        {
            title: "Pedidos Pendientes",
            value: safeStats.pending_orders.toString(),
            icon: ShoppingCart,
            color: "text-amber-600",
            bg: "bg-amber-50",
            subtext: `${safeStats.pending_deliveries} reparto${safeStats.pending_deliveries !== 1 ? 's' : ''} activo${safeStats.pending_deliveries !== 1 ? 's' : ''}`
        },
        {
            title: "Stock Crítico",
            value: `${safeStats.critical_stock_count}`,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-50",
            badge: safeStats.critical_stock_count > 0 ? "⚠ Reponer" : null,
            subtext: "productos bajo mínimo"
        },
        {
            title: "Deuda Total",
            value: `$${safeStats.overdue_balance?.toLocaleString('es-AR') || '0'}`,
            icon: Users,
            color: "text-slate-600",
            bg: "bg-slate-100",
            subtext: `${safeStats.debtors_count} cliente${safeStats.debtors_count !== 1 ? 's' : ''} con deuda`
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header with greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                        {getGreeting()}, <span className="text-blue-600">{username || 'Admin'}</span> 👋
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50 self-end sm:self-auto"
                    title="Recargar datos"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button onClick={fetchStats} className="text-xs underline font-medium">Reintentar</button>
                </div>
            )}

            {/* Stats Cards - skeleton on load */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    cards.map((card, idx) => (
                        <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 truncate">{card.title}</p>
                                    <h3 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{card.value}</h3>
                                    {card.subtext && <p className="text-[10px] md:text-xs text-slate-400 mt-1">{card.subtext}</p>}
                                </div>
                                <div className={`p-2 md:p-3 rounded-xl ${card.bg} ${card.color} flex-shrink-0 ml-2`}>
                                    <card.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </div>
                            {(card.change || card.badge) && (
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    {card.change && (
                                        <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {card.change}
                                        </span>
                                    )}
                                    {card.badge && (
                                        <span className="text-[10px] md:text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">{card.badge}</span>
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
                <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Tendencia de Ventas (Últimos 7 días)</h3>
                    <div className="h-48 md:h-64">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center text-slate-300">
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={safeStats.sales_history}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={50} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`$${Number(value || 0).toLocaleString('es-AR')}`, 'Ventas']}
                                        labelStyle={{ color: '#64748b', fontSize: 12 }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Deliveries */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Repartos Recientes</h3>
                    <div className="space-y-2.5">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse">
                                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
                                        <div className="h-2 bg-slate-100 rounded w-32" />
                                    </div>
                                </div>
                            ))
                        ) : recentDeliveries.length === 0 ? (
                            <div className="text-center text-slate-400 text-sm py-8">
                                <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                No hay repartos recientes.
                            </div>
                        ) : (
                            recentDeliveries.map((d) => {
                                const isComplete = d.orders_count > 0 && d.delivered_count === d.orders_count;
                                const progress = d.orders_count > 0 ? Math.round((d.delivered_count / d.orders_count) * 100) : 0;
                                return (
                                    <div key={d.id} className="flex items-center justify-between p-2.5 md:p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer" onClick={() => navigate('/deliveries')}>
                                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                            <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${isComplete ? 'bg-green-100' : 'bg-amber-50'}`}>
                                                <Truck className={`w-4 h-4 md:w-5 md:h-5 ${isComplete ? 'text-green-600' : 'text-amber-500'}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-xs md:text-sm truncate">Reparto #{d.id}</p>
                                                <p className="text-[10px] md:text-xs text-slate-500">
                                                    {d.delivered_count}/{d.orders_count} · {new Date(d.created_at).toLocaleDateString('es-AR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {progress}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <button
                            onClick={() => navigate('/deliveries')}
                            className="w-full mt-1 text-blue-600 text-sm font-medium hover:text-blue-800 transition py-1"
                        >
                            Ver todos →
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-5">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-blue-700 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95"
                    >
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        Nuevo Pedido
                    </button>
                    <button
                        onClick={() => navigate('/current-accounts')}
                        className="p-3 md:p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-emerald-700 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95"
                    >
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        Cobrar Deudas
                    </button>
                    <button
                        onClick={() => navigate('/deliveries')}
                        className="p-3 md:p-4 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-xl text-amber-700 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95"
                    >
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition">
                            <Truck className="w-5 h-5" />
                        </div>
                        Ver Repartos
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="p-3 md:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-slate-600 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95"
                    >
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition">
                            <Package className="w-5 h-5" />
                        </div>
                        Productos
                    </button>
                </div>
            </div>
        </div>
    );
}
