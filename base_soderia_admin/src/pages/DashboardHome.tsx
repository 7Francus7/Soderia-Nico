import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { DollarSign, Truck, AlertTriangle, Users, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    sales_today: number;
    pending_deliveries: number;
    critical_stock_count: number;
    overdue_balance: number;
    sales_change_pct: number;
    pending_change: number;
    sales_history: { date: string, amount: number }[];
}

interface Delivery {
    id: number;
    order_id: number;
    status: string;
}

export default function DashboardHome() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsResponse = await api.get('/dashboard/dashboard-stats');
                setStats(statsResponse.data);
                const deliveriesResponse = await api.get('/deliveries/?limit=5&sort=-id');
                setRecentDeliveries(deliveriesResponse.data);
            } catch (error: any) {
                setError("No se pudieron cargar los datos del dashboard. " + (error.message || ""));
                setStats({
                    sales_today: 0,
                    pending_deliveries: 0,
                    critical_stock_count: 0,
                    overdue_balance: 0,
                    sales_change_pct: 0,
                    pending_change: 0,
                    sales_history: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Cargando métricas...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-bold">Error de conexión</p>
                    <p className="text-sm break-words">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-sm underline mt-1">Reintentar</button>
                </div>
            </div>
        );
    }

    const safeStats = stats || {
        sales_today: 0,
        pending_deliveries: 0,
        critical_stock_count: 0,
        overdue_balance: 0,
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
            change: `+${safeStats.sales_change_pct}%`,
            trend: "up"
        },
        {
            title: "Repartos Pendientes",
            value: safeStats.pending_deliveries.toString(),
            icon: Truck,
            color: "text-amber-600",
            bg: "bg-amber-50",
            change: `${safeStats.pending_change}`,
            trend: "down"
        },
        {
            title: "Stock Crítico",
            value: `${safeStats.critical_stock_count} prod.`,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-50",
            badge: "Alerta Roja"
        },
        {
            title: "CC Vencido",
            value: `$${safeStats.overdue_balance?.toLocaleString('es-AR') || '0'}`,
            icon: Users,
            color: "text-slate-600",
            bg: "bg-slate-100",
            subtext: "Morosos"
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-slate-500 text-sm mt-1">Resumen operativo del día.</p>
            </div>

            {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                                <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 truncate">{card.title}</p>
                                <h3 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{card.value}</h3>
                                {card.subtext && <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>}
                            </div>
                            <div className={`p-2 md:p-3 rounded-xl ${card.bg} ${card.color} flex-shrink-0 ml-2`}>
                                <card.icon className="w-4 h-4 md:w-6 md:h-6" />
                            </div>
                        </div>
                        {(card.change || card.badge) && (
                            <div className="mt-3 md:mt-4 flex items-center gap-2 flex-wrap">
                                {card.change && (
                                    <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1 ${card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {card.change}
                                    </span>
                                )}
                                {card.badge && (
                                    <span className="text-[10px] md:text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 md:py-1 rounded-full animate-pulse">{card.badge}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Chart and Recent Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-6">Tendencia de Ventas (Últimos 7 días)</h3>
                    <div className="h-48 md:h-64">
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
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} width={40} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Deliveries */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Repartos Recientes</h3>
                    <div className="space-y-3 md:space-y-4">
                        {recentDeliveries.map((d) => (
                            <div key={d.id} className="flex items-center justify-between p-2.5 md:p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="bg-white p-1.5 md:p-2 rounded-lg border border-slate-200 flex-shrink-0">
                                        <Truck className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 text-xs md:text-sm truncate">Pedido #{d.order_id}</p>
                                        <p className="text-[10px] md:text-xs text-slate-500">{d.status.replace('_', ' ').toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.status === 'pending' ? 'bg-yellow-400' :
                                    d.status === 'in_transit' ? 'bg-blue-500' :
                                        d.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                            </div>
                        ))}
                        {recentDeliveries.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-4">No hay actividad reciente.</div>
                        )}
                        <button
                            onClick={() => navigate('/deliveries')}
                            className="w-full mt-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition"
                        >
                            Ver todos
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-bold text-slate-800">Acciones Rápidas</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-blue-700 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95"
                    >
                        <span className="text-lg md:text-xl">🛒</span>
                        Nuevo Pedido
                    </button>
                    <button
                        onClick={() => navigate('/current-accounts')}
                        className="p-3 md:p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 active:scale-95"
                    >
                        <span className="text-lg md:text-xl">💳</span>
                        Cuentas Cte.
                    </button>
                    <button
                        onClick={() => navigate('/deliveries')}
                        className="p-3 md:p-4 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-xl text-amber-700 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 active:scale-95"
                    >
                        <span className="text-lg md:text-xl">🚚</span>
                        Ver Repartos
                    </button>
                    <button
                        onClick={() => navigate('/clients')}
                        className="p-3 md:p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 font-medium text-xs md:text-sm transition text-center flex flex-col items-center gap-1.5 md:gap-2 active:scale-95"
                    >
                        <span className="text-lg md:text-xl">👥</span>
                        Clientes
                    </button>
                </div>
            </div>
        </div>
    );
}
