import { CheckCircle, MapPin, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BUSINESS } from "@/lib/business";

const GROCERY_HIGHLIGHTS = [
  "Rice, atta, and lentils",
  "Spices and pantry staples",
  "Fresh produce",
  "Dairy, paneer, and frozen foods",
];

const HALAL_HIGHLIGHTS = [
  "Chicken",
  "Goat and lamb",
  "Beef",
  "Fresh cuts prepared in store",
];

export default function GroceryHalal() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="grid md:grid-cols-2 min-h-[40vh] md:min-h-[60vh]">
        <section className="relative group overflow-hidden bg-orange-900">
          <img src="/images/grocery-hero.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Shelves of Indian grocery essentials" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Desi Groceries</h1>
            <p className="text-lg opacity-90 mb-6">Spices, lentils, rice, produce, and everyday essentials.</p>
            <div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full" asChild>
                <a href={BUSINESS.groceryOrderUrl} target="_blank" rel="noopener noreferrer">Order Groceries</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative group overflow-hidden bg-green-900">
          <img src="/images/halal-hero.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Fresh halal meat counter" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h2 className="text-4xl font-bold mb-2">Fresh Halal Meat</h2>
            <p className="text-lg opacity-90 mb-6">Chicken, goat, lamb, and beef selections prepared in store.</p>
            <div>
              <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full" asChild>
                <a href={BUSINESS.phoneTel}>Call for Availability</a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <ShoppingBag className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Grocery Selection</h2>
              <ul className="space-y-3 text-muted-foreground">
                {GROCERY_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <Package className="w-10 h-10 text-secondary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Halal Butcher</h2>
              <ul className="space-y-3 text-muted-foreground">
                {HALAL_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted border-none shadow-none">
          <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <MapPin className="w-12 h-12 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Visit the Frisco Store</h2>
              <p className="text-muted-foreground text-sm">Inventory and pricing change. Visit or call for current in-store availability.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild><a href={BUSINESS.phoneTel}>Call Store</a></Button>
              <Button asChild><a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
