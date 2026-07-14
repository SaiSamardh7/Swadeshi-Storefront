import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingBag, UtensilsCrossed, Coffee, Droplet, Candy, MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { BUSINESS } from "@/lib/business";
import { FULL_MENU } from "@/data/fullmenu";

const CATEGORIES = [
  { title: "Grocery", icon: ShoppingBag, desc: "Everyday essentials", img: "/images/lassi.jpg" },
  { title: "Halal Meat", icon: UtensilsCrossed, desc: "Fresh selection", img: "/images/biryani.jpg" },
  { title: "Cooked Food", icon: UtensilsCrossed, desc: "Ready to eat", img: "/images/paneer.jpg" },
  { title: "Sweets", icon: Candy, desc: "Traditional desserts", img: "/images/sweets.jpg" },
  { title: "Beverages", icon: Droplet, desc: "Lassi & drinks", img: "/images/lassi.jpg" },
  { title: "Spices", icon: Coffee, desc: "Authentic flavors", img: "/images/dosa.jpg" }
];

const MENU_ITEMS = FULL_MENU.flatMap((section) =>
  section.categories.flatMap((category) => category.items)
);

const POPULAR_ITEMS = ([
  [/chicken dum biryani/i, "/images/biryani.jpg"],
  [/^masala dosa$/i, "/images/dosa.jpg"],
  [/^paneer butter masala$/i, "/images/paneer.jpg"],
  [/^gulab jamun/i, "/images/sweets.jpg"],
  [/mango lassi/i, "/images/lassi.jpg"],
] as const).flatMap(([pattern, img]) => {
  const item = MENU_ITEMS.find(({ name }) => pattern.test(name));
  return item ? [{ ...item, img }] : [];
});

export default function Home() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero */}
      <section className="relative bg-muted py-20 px-4 overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-secondary">Halal Meat Selection</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-secondary">Fresh Daily</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Neighborhood <span className="text-primary">Desi Market</span> & Kitchen
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              From fresh halal meat and everyday groceries to authentic hot meals and catering. Everything you need, in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href={BUSINESS.orderUrl} target="_blank" rel="noopener noreferrer">Order Online</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary/10" asChild>
                <a href={BUSINESS.groceryOrderUrl} target="_blank" rel="noopener noreferrer">Order Groceries</a>
              </Button>
            </div>
            <div className="mt-8">
              <Link href="/about" className="text-sm font-medium text-primary hover:underline">
                Discover Our Story &rarr;
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img src="/images/biryani.jpg" alt="Delicious Biryani" className="relative z-10 rounded-2xl shadow-2xl object-cover aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.title} href={cat.title === "Cooked Food" ? "/menu" : "/grocery-halal"}>
              <Card className="hover-elevate cursor-pointer transition-all border-none shadow-sm hover:shadow-md h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-primary mb-2">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Items Carousel */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold">Popular Right Now</h2>
            <Link href="/menu" className="text-sm font-medium text-primary flex items-center hover:underline">
              View full menu <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {POPULAR_ITEMS.map((item) => (
                <div key={item.name} className="flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_25%] min-w-0">
                  <Card className="overflow-hidden border-none shadow-sm h-full flex flex-col">
                    <img src={item.img} alt={item.name} className="h-48 w-full object-cover" />
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catering & Location */}
      <section className="py-16 px-4 container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-none shadow-md bg-secondary text-secondary-foreground relative">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/images/catering-hero.jpg')] bg-cover bg-center" />
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold mb-4">Planning an Event?</h2>
              <p className="mb-8 opacity-90 max-w-sm">From corporate lunches to wedding banquets, our catering service brings authentic flavor to your guests.</p>
              <div className="mt-auto">
                <Button className="bg-white text-secondary hover:bg-white/90 rounded-full" asChild>
                  <Link href="/catering">Explore Catering</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-md bg-muted">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="h-48 bg-card w-full flex items-center justify-center border-b">
                {/* Simulated map */}
                <MapPin className="h-12 w-12 text-primary/40" />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Visit Our Store</h3>
                <p className="text-muted-foreground mb-4">{BUSINESS.address}<br/>{BUSINESS.hoursShort}</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="rounded-full" asChild>
                    <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a>
                  </Button>
                  <Button variant="outline" className="rounded-full border-primary text-primary" asChild>
                    <a href={BUSINESS.phoneTel}>Call Us</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
