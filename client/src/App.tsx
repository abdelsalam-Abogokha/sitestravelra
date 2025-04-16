import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./lib/auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import FlightsPage from "@/pages/FlightsPage";
import HotelsPage from "@/pages/HotelsPage";
import VisasPage from "@/pages/VisasPage";
import PackagesPage from "@/pages/PackagesPage";
import ShippingPage from "@/pages/ShippingPage";
import TranslationPage from "@/pages/TranslationPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import InstallPage from "@/pages/InstallPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ApiManagementPage from "@/pages/admin/ApiManagementPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import UsersPage from "@/pages/admin/UsersPage";
import ContentPage from "@/pages/admin/ContentPage";
import ShippingTranslationPage from "@/pages/admin/ShippingTranslationPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import AiChatSettingsPage from "@/pages/admin/AiChatSettingsPage";

function Router() {
  return (
    <Switch>
      {/* Installation Route */}
      <Route path="/install" component={InstallPage} />
      
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/flights" component={FlightsPage} />
      <Route path="/hotels" component={HotelsPage} />
      <Route path="/visas" component={VisasPage} />
      <Route path="/packages" component={PackagesPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/translation" component={TranslationPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={DashboardPage} />
      <Route path="/admin/apis" component={ApiManagementPage} />
      <Route path="/admin/bookings" component={BookingsPage} />
      <Route path="/admin/users" component={UsersPage} />
      <Route path="/admin/content" component={ContentPage} />
      <Route path="/admin/shipping-translation" component={ShippingTranslationPage} />
      <Route path="/admin/reports" component={ReportsPage} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route path="/admin/ai-chat" component={AiChatSettingsPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
