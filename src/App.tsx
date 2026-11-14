import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/src/hooks/useAuth";
import { CartProvider } from "@/src/hooks/useCart";
import { LocaleProvider } from "@/src/hooks/useLocale";
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
import AboutPage from "@/src/pages/AboutPage";
import { mapLocalizedRoutes } from "@/src/lib/i18n/publicPaths";

function L({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

const homeRoutes = mapLocalizedRoutes("", <L><HomePage /></L>);
const aboutRoutes = mapLocalizedRoutes("about", <L><AboutPage /></L>);
const restaurantsRoutes = mapLocalizedRoutes("restaurants", <L><RestaurantsPage /></L>);
const marketsRoutes = mapLocalizedRoutes("markets", <L><MarketsPage /></L>);
const deliveryRoutes = mapLocalizedRoutes("delivery", <L><DeliveryPage /></L>);
const categoryRoutes = mapLocalizedRoutes("products/:slug", <L><CategoryPage /></L>);
const requestRoutes = mapLocalizedRoutes("request", <L><RequestPage /></L>);
const cartRoutes = mapLocalizedRoutes("cart", <L><CartPage /></L>);
const checkoutRoutes = mapLocalizedRoutes("checkout", <L><CheckoutPage /></L>);
const payRoutes = mapLocalizedRoutes("pay", <L><PaymentPage /></L>);
const paymentCbRoutes = mapLocalizedRoutes("payment/callback", <L><PaymentCallbackPage /></L>);
const orderOkRoutes = mapLocalizedRoutes("order-success", <L><OrderSuccessPage /></L>);
const loginRoutes = mapLocalizedRoutes("login", <L><AuthPage mode="login" audience="customer" /></L>);
const registerRoutes = mapLocalizedRoutes("register", <L><AuthPage mode="register" audience="customer" /></L>);
const accountRoutes = mapLocalizedRoutes("account", <L><AccountPage /></L>);

const localizedPublic = [
  ...homeRoutes,
  ...aboutRoutes,
  ...restaurantsRoutes,
  ...marketsRoutes,
  ...deliveryRoutes,
  ...categoryRoutes,
  ...requestRoutes,
  ...cartRoutes,
  ...checkoutRoutes,
  ...payRoutes,
  ...paymentCbRoutes,
  ...orderOkRoutes,
  ...loginRoutes,
  ...registerRoutes,
  ...accountRoutes,
];

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {localizedPublic.map(({ path, element }) => (
              <Route key={path || "home"} path={path || "/"} element={element} />
            ))}
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