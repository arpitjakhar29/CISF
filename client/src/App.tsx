import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import ClaimsPage from "@/pages/claims-page";
import EntitlementsPage from "@/pages/entitlements-page";
import FormPage from "@/pages/form-page";
import HelpSupportPage from "@/pages/help-support-page";
import AuthPage from "@/pages/auth-page";
import AboutPage from "@/pages/about-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/claims" component={ClaimsPage} />
      <ProtectedRoute path="/entitlements" component={EntitlementsPage} />
      <ProtectedRoute path="/submit-claim" component={FormPage} />
      <ProtectedRoute path="/help-support" component={HelpSupportPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
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
