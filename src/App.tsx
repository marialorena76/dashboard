import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import ProtectedMembers from "./pages/ProtectedMembers";
import LifePlans from "./pages/LifePlans";
import LifePayments from "./pages/LifePayments";
import HelpCenter from "./pages/HelpCenter";
import MySettings from "./pages/MySettings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/profile"} component={MyProfile} />
      <Route path={"/members"} component={ProtectedMembers} />
      <Route path={"/plans"} component={LifePlans} />
      <Route path={"/payments"} component={LifePayments} />
      <Route path={"/help"} component={HelpCenter} />
      <Route path={"/settings"} component={MySettings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

