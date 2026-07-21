import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { CartProvider } from "@/hooks/use-cart";
import { Layout } from "@/components/layout";

const Home = lazy(() => import("@/pages/home"));
const Menu = lazy(() => import("@/pages/menu"));
const GroceryHalal = lazy(() => import("@/pages/grocery-halal"));
const Catering = lazy(() => import("@/pages/catering"));
const About = lazy(() => import("@/pages/about"));
const Location = lazy(() => import("@/pages/location"));
const Contact = lazy(() => import("@/pages/contact"));
const Gallery = lazy(() => import("@/pages/gallery"));
const Reviews = lazy(() => import("@/pages/reviews"));
const Login = lazy(() => import("@/pages/login"));
const Cart = lazy(() => import("@/pages/cart"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageFallback() {
  return (
    <div className="container mx-auto px-4 py-24 text-center text-muted-foreground" role="status">
      Loading page…
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
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
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
