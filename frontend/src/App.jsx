import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import AiChatbot from "./components/AiChatbot";
import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { ProductsPage, ProductDetailsPage } from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import AiAdvisorPage from "./pages/AiAdvisorPage";
import { ProductManagementPage, QuotesPage } from "./pages/ManagementPages";
import {
  CustomerDashboard,
  SupplierDashboard,
  AdminDashboard,
} from "./pages/Dashboards";
import {
  FavoritesPage,
  ComparePage,
  ProfilePage,
  SettingsPage,
} from "./pages/AccountPages";
import NotFoundPage from "./pages/ErrorPages";
import { useAuth } from "./context/AuthContext";
function DashboardRedirect() {
  const { user } = useAuth();
  return (
    <Navigate
      to={
        user?.role === "supplier"
          ? "/supplier"
          : user?.role === "admin"
            ? "/admin"
            : "/customer"
      }
      replace
    />
  );
}
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ai-advisor" element={<AiAdvisorPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["customer"]} />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["supplier"]} />}>
            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/products" element={<ProductManagementPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <AiChatbot />
    </>
  );
}
