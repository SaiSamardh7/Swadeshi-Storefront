import { Link, useLocation } from "wouter";
import { Home, Grid, MapPin, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, ORDER_HREF, ORDER_LABEL } from "@/lib/business";
import { useCart } from "@/hooks/use-cart";
import { useGetMe } from "@workspace/api-client-react";
import swadeshiLogo from "@/assets/swadeshi-logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const { data: me } = useGetMe();
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src={swadeshiLogo} alt="Swadeshi - Grocery, Halal Meat, Indian Kitchen" className="h-11 w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className={`transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-foreground/80'}`}>Home</Link>
              <Link href="/menu" className={`transition-colors hover:text-primary ${location === '/menu' ? 'text-primary' : 'text-foreground/80'}`}>Menu</Link>
              <Link href="/delivery" className={`transition-colors hover:text-primary ${location === '/delivery' ? 'text-primary' : 'text-foreground/80'}`}>Delivery</Link>
              <Link href="/grocery-halal" className={`transition-colors hover:text-primary ${location === '/grocery-halal' ? 'text-primary' : 'text-foreground/80'}`}>Grocery & Halal</Link>
              <Link href="/catering" className={`transition-colors hover:text-primary ${location === '/catering' ? 'text-primary' : 'text-foreground/80'}`}>Catering</Link>
            </nav>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <Link
              href="/cart"
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href={me?.user ? "/cart" : "/login"}
              aria-label={me?.user ? "Account" : "Log in"}
              className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-accent sm:inline-flex"
            >
              <User className="h-5 w-5" />
            </Link>
            <Button asChild className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              <a href={ORDER_HREF} target="_blank" rel="noopener noreferrer">{ORDER_LABEL}</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-12 mt-12 mb-16 md:mb-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <img src={swadeshiLogo} alt="Swadeshi Logo" className="h-10 w-auto object-contain" />
              </Link>
              <p className="text-sm text-muted-foreground">Your everyday Indian grocery store, halal butcher, and quick-service restaurant.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">Our Story</Link></li>
                <li><Link href="/location" className="hover:text-primary">Locations & Hours</Link></li>
                <li><Link href="/gallery" className="hover:text-primary">Photo Gallery</Link></li>
                <li><Link href="/reviews" className="hover:text-primary">Customer Reviews</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href={ORDER_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Order Food Online</a></li>
                <li><a href={BUSINESS.groceryOrderUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Order Groceries</a></li>
                <li><Link href="/catering" className="hover:text-primary">Catering Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{BUSINESS.address}</li>
                <li><a href={BUSINESS.phoneTel} className="hover:text-primary">{BUSINESS.phoneDisplay}</a></li>
                <li><a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">{BUSINESS.email}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hours</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {BUSINESS.hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t">
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full">Halal Meat Selection</span>
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full">Fresh Daily</span>
            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full">Pickup & Delivery Options</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/menu" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/menu' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Grid className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </Link>
          <a href={ORDER_HREF} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-medium">Order</span>
          </a>
          <Link href="/location" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/location' ? 'text-primary' : 'text-muted-foreground'}`}>
            <MapPin className="h-5 w-5" />
            <span className="text-[10px] font-medium">Location</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
