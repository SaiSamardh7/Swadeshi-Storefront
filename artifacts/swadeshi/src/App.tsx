import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import GroceryHalal from "@/pages/grocery-halal";
import Catering from "@/pages/catering";
import About from "@/pages/about";
import Location from "@/pages/location";
import Contact from "@/pages/contact";
import Gallery from "@/pages/gallery";
import Reviews from "@/pages/reviews";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/grocery-halal" component={GroceryHalal} />
        <Route path="/catering" component={Catering} />
        <Route path="/about" component={About} />
        <Route path="/location" component={Location} />
        <Route path="/contact" component={Contact} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/reviews" component={Reviews} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
