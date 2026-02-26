import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
       LogOut, LayoutDashboard, ShoppingCart, Truck,
       Package, Users, CreditCard, Wifi, Menu, X
} from "lucide-react";

const navItems = [
       { name: "Resumen", icon: LayoutDashboard, path: "/" },
       { name: "Pedidos", icon: ShoppingCart, path: "/orders" },
       { name: "Repartos", icon: Truck, path: "/deliveries" },
       { name: "Cta. Cte.", icon: CreditCard, path: "/current-accounts" },
       { name: "Productos", icon: Package, path: "/products" },
       { name: "Clientes", icon: Users, path: "/clients" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
       const { logout, username } = useAuth();
       const navigate = useNavigate();
       const location = useLocation();
       const [sidebarOpen, setSidebarOpen] = useState(false);

       // Cerrar sidebar al cambiar de ruta (mobile)
       useEffect(() => {
              setSidebarOpen(false);
       }, [location.pathname]);

       // Cerrar sidebar con Escape
       useEffect(() => {
              const handleEsc = (e: KeyboardEvent) => {
                     if (e.key === "Escape") setSidebarOpen(false);
              };
              window.addEventListener("keydown", handleEsc);
              return () => window.removeEventListener("keydown", handleEsc);
       }, []);

       const handleLogout = () => {
              logout();
              navigate("/login");
       };

       return (
              <div className="min-h-screen bg-slate-50 flex">

                     {/* ── OVERLAY (mobile) ─────────────────────────── */}
                     {sidebarOpen && (
                            <div
                                   className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                                   onClick={() => setSidebarOpen(false)}
                            />
                     )}

                     {/* ── SIDEBAR ──────────────────────────────────── */}
                     <aside
                            className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 text-white
          flex flex-col shadow-2xl z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
                     >
                            {/* Logo */}
                            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
                                                 <span className="text-lg">🧃</span>
                                          </div>
                                          <div>
                                                 <h1 className="text-base font-bold text-white tracking-tight leading-none">SODERÍA NICO</h1>
                                                 <p className="text-slate-500 text-xs mt-0.5">Panel Admin</p>
                                          </div>
                                   </div>
                                   {/* Cerrar en mobile */}
                                   <button
                                          className="lg:hidden text-slate-400 hover:text-white p-1"
                                          onClick={() => setSidebarOpen(false)}
                                   >
                                          <X className="w-5 h-5" />
                                   </button>
                            </div>

                            {/* Online badge */}
                            <div className="px-5 py-3 border-b border-slate-800/50">
                                   <div className="flex items-center gap-1.5">
                                          <Wifi className="w-3 h-3 text-emerald-400" />
                                          <span className="text-xs text-emerald-400 font-medium">Sistema en línea</span>
                                   </div>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                   {navItems.map((item) => {
                                          const isActive = location.pathname === item.path;
                                          return (
                                                 <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl
                  transition-all duration-150 group
                  ${isActive
                                                                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                                                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                               }
                `}
                                                 >
                                                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`} />
                                                        <span className="font-medium text-sm">{item.name}</span>
                                                 </Link>
                                          );
                                   })}
                            </nav>

                            {/* User + Logout */}
                            <div className="p-4 border-t border-slate-800">
                                   <div className="flex items-center space-x-3 mb-3 p-3 bg-slate-800 rounded-xl">
                                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow">
                                                 {username?.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="overflow-hidden flex-1">
                                                 <p className="text-sm font-semibold truncate text-white">{username}</p>
                                                 <p className="text-xs text-slate-400">Administrador</p>
                                          </div>
                                   </div>
                                   <button
                                          onClick={handleLogout}
                                          className="flex items-center text-slate-400 hover:text-red-400 space-x-2 px-3 py-2.5 hover:bg-red-500/10 rounded-xl w-full transition group"
                                   >
                                          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                          <span className="text-sm font-medium">Cerrar Sesión</span>
                                   </button>
                            </div>
                     </aside>

                     {/* ── MAIN CONTENT ─────────────────────────────── */}
                     <div className="flex-1 flex flex-col min-h-screen lg:ml-64">

                            {/* Top bar mobile */}
                            <header className="sticky top-0 z-20 lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                                   <button
                                          onClick={() => setSidebarOpen(true)}
                                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                   >
                                          <Menu className="w-5 h-5" />
                                   </button>
                                   <div className="flex items-center gap-2">
                                          <span className="text-base font-bold text-slate-800">
                                                 {navItems.find(n => n.path === location.pathname)?.name ?? "Dashboard"}
                                          </span>
                                   </div>
                                   <div className="ml-auto flex items-center gap-1.5">
                                          <Wifi className="w-3 h-3 text-emerald-500" />
                                          <span className="text-[10px] text-emerald-600 font-medium">En línea</span>
                                   </div>
                            </header>

                            {/* Page content */}
                            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
                                   <div className="max-w-7xl mx-auto">
                                          {children}
                                   </div>
                            </main>

                            {/* ── BOTTOM NAV (mobile only) ──────────────── */}
                            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 shadow-lg">
                                   <div className="grid grid-cols-6 h-16">
                                          {navItems.map((item) => {
                                                 const isActive = location.pathname === item.path;
                                                 return (
                                                        <Link
                                                               key={item.path}
                                                               to={item.path}
                                                               className={`
                    flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors
                    ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}
                  `}
                                                        >
                                                               <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                                                               <span className="leading-none">{item.name}</span>
                                                        </Link>
                                                 );
                                          })}
                                   </div>
                            </nav>
                     </div>
              </div>
       );
}
