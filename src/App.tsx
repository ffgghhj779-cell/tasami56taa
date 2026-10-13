import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/src/hooks/useAuth";
import { CartProvider } from "@/src/hooks/useCart";
import HomePage from "@/src/pages/HomePage";
import AccountPage from "@/src/pages/AccountPage";
import RequestPage from "@/src/pages/RequestPage";
import CartPage from "@/src/pages/CartPage";
import CheckoutPage from "@/src/pages/CheckoutPage";
import OrderSuccessPage from "@/src/pages/OrderSuccessPage";
import PaymentPage from "@/src/pages/PaymentPage";
import PaymentCallbackPage from "@/src/pages/PaymentCallbackPage";
import AdminLayout from "@/src/pages/admin/AdminLayout";
import AuthPage from "@/src/pages/admin/AuthPage";
import DashboardPage from "@/src/pages/admin/DashboardPage";
import LeadsPage from "@/src/pages/admin/LeadsPage";
import OrdersPage from "@/src/pages/admin/OrdersPage";
import ProductsPage from "@/src/pages/admin/ProductsPage";
import TestimonialsPage from "@/src/pages/admin/TestimonialsPage";
import FaqsPage from "@/src/pages/admin/FaqsPage";
import WhatsAppPage from "@/src/pages/admin/WhatsAppPage";
import CategoryPage from "@/src/pages/CategoryPage";
import { DeliveryPage, MarketsPage, RestaurantsPage } from "@/src/pages/SupplyPages";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/products/:slug" element={<CategoryPage />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pay" element={<PaymentPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<AuthPage mode="login" audience="customer" />} />
            <Route path="/register" element={<AuthPage mode="register" audience="customer" />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin/login" element={<AuthPage mode="login" audience="team" />} />
            <Route path="/admin/register" element={<AuthPage mode="register" audience="team" />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="whatsapp" element={<WhatsAppPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
