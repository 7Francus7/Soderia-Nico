
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import LogInView from './pages/LoginView';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import OrdersView from './pages/OrdersView';
import DeliveriesView from './pages/DeliveriesView';
import CurrentAccountsView from './pages/CurrentAccountsView';
import ProductsView from './pages/ProductsView';
import ClientsView from './pages/ClientsView';
import SettingsView from './pages/SettingsView';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
       const { isAuthenticated } = useAuth();
       return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
       return (
              <Routes>
                     <Route path="/login" element={<LogInView />} />

                     {/* Protected Routes */}
                     <Route path="/" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <DashboardHome />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/orders" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <OrdersView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/deliveries" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <DeliveriesView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/current-accounts" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <CurrentAccountsView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/products" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <ProductsView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/clients" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <ClientsView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />

                     <Route path="/settings" element={
                            <PrivateRoute>
                                   <DashboardLayout>
                                          <SettingsView />
                                   </DashboardLayout>
                            </PrivateRoute>
                     } />
              </Routes >
       );
}

function App() {
       return (
              <BrowserRouter>
                     <AuthProvider>
                            <AppRoutes />
                            <Toaster position="top-right" richColors />
                     </AuthProvider>
              </BrowserRouter>
       );
}

export default App;
