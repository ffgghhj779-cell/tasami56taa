import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/src/hooks/useAuth";
import HomePage from "@/src/pages/HomePage";
import AdminLayout from "@/src/pages/admin/AdminLayout";
import AuthPage from "@/src/pages/admin/AuthPage";
import DashboardPage from "@/src/pages/admin/DashboardPage";
import LeadsPage from "@/src/pages/admin/LeadsPage";
import ProductsPage from "@/src/pages/admin/ProductsPage";
import TestimonialsPage from "@/src/pages/admin/TestimonialsPage";
import FaqsPage from "@/src/pages/admin/FaqsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AuthPage mode="login" />} />
          <Route path="/admin/register" element={<AuthPage mode="register" />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="faqs" element={<FaqsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
