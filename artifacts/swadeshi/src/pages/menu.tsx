import { useState, useMemo } from "react";
import { Search, Flame, Leaf, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";

const MENU_ITEMS = [
  { id: "1", name: "Chicken Biryani", price: 14.99, img: "/images/biryani.png", category: "Thali/Meals", isVeg: false, spice: 2, rating: 4.8 },
  { id: "2", name: "Masala Dosa", price: 10.99, img: "/images/dosa.png", category: "Thali/Meals", isVeg: true, spice: 1, rating: 4.7 },
  { id: "3", name: "Paneer Butter Masala", price: 13.99, img: "/images/paneer.png", category: "Thali/Meals", isVeg: true, spice: 1, rating: 4.9 },
  { id: "4", name: "Gulab Jamun", price: 5.99, img: "/images/sweets.png", category: "Sweets", isVeg: true, spice: 0, rating: 4.6 },
  { id: "5", name: "Mango Lassi", price: 4.99, img: "/images/lassi.png", category: "Drinks", isVeg: true, spice: 0, rating: 4.9 },
  { id: "6", name: "Idli Sambar", price: 8.99, img: "/images/idli.png", category: "Thali/Meals", isVeg: true, spice: 1, rating: 4.5 },
  { id: "7", name: "Pani Puri", price: 6.99, img: "/images/panipuri.png", category: "Chaat", isVeg: true, spice: 2, rating: 4.8 },
  { id: "8", name: "Punjabi Samosa (2pc)", price: 4.99, img: "/images/samosa.png", category: "Chaat", isVeg: true, spice: 1, rating: 4.7 },
  { id: "9", name: "Garlic Naan", price: 3.49, img: "/images/naan.png", category: "Breads", isVeg: true, spice: 0, rating: 4.8 },
  { id: "10", name: "Maharaja Veg Thali", price: 18.99, img: "/images/thali.png", category: "Thali/Meals", isVeg: true, spice: 2, rating: 4.9 },
  { id: "11", name: "Chicken Tikka Wrap", price: 9.99, img: "/images/wrap.png", category: "Wraps", isVeg: false, spice: 2, rating: 4.6 },
  { id: "12", name: "Tomato Coriander Soup", price: 5.99, img: "/images/soup.png", category: "Soups", isVeg: true, spice: 1, rating: 4.4 },
  { id: "13", name: "Goat Curry", price: 16.99, img: "/images/biryani.png", category: "Thali/Meals", isVeg: false, spice: 3, rating: 4.7 },
  { id: "14", name: "Paneer Kathi Roll", price: 8.99, img: "/images/wrap.png", category: "Wraps", isVeg: true, spice: 1, rating: 4.5 },
  { id: "15", name: "Masala Chai", price: 3.99, img: "/images/lassi.png", category: "Drinks", isVeg: true, spice: 0, rating: 4.8 },
  { id: "16", name: "Rasmalai", price: 6.99, img: "/images/sweets.png", category: "Sweets", isVeg: true, spice: 0, rating: 4.7 },
];

const CATEGORIES = ["All", "Thali/Meals", "Wraps", "Soups", "Chaat", "Sweets", "Drinks", "Veg", "Non-Veg"];

export default function Menu() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("all");
  const [diet, setDiet] = useState("all");

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category Filter
      if (activeCategory === "Veg" && !item.isVeg) return false;
      if (activeCategory === "Non-Veg" && item.isVeg) return false;
      if (activeCategory !== "All" && activeCategory !== "Veg" && activeCategory !== "Non-Veg" && item.category !== activeCategory) return false;

      // Search Filter
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;

      // Spice Filter
      if (spiceLevel !== "all" && item.spice !== parseInt(spiceLevel)) return false;

      // Diet Filter
      if (diet === "veg" && !item.isVeg) return false;
      if (diet === "non-veg" && item.isVeg) return false;

      return true;
    });
  }, [activeCategory, search, spiceLevel, diet]);

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero Banner */}
      <div className="w-full h-48 md:h-64 bg-secondary flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <img src="/images/biryani.png" className="w-1/3 h-full object-cover opacity-60" alt="" />
          <img src="/images/dosa.png" className="w-1/3 h-full object-cover opacity-60" alt="" />
          <img src="/images/thali.png" className="w-1/3 h-full object-cover opacity-60" alt="" />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10 text-center px-4">
          Authentic Flavors, <span className="text-primary">Cooked Fresh</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-white text-foreground hover:bg-muted border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Grid */}
          <div className="flex-1">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search menu..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select value={spiceLevel} onValueChange={setSpiceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Spice Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Spice Levels</SelectItem>
                  <SelectItem value="0">Mild</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">Hot</SelectItem>
                  <SelectItem value="3">Extra Hot</SelectItem>
                </SelectContent>
              </Select>

              <Select value={diet} onValueChange={setDiet}>
                <SelectTrigger>
                  <SelectValue placeholder="Dietary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Diets</SelectItem>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="popular">
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        <h3 className="font-semibold leading-tight line-clamp-1">{item.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-4 text-orange-500">
                      {Array.from({ length: item.spice }).map((_, i) => (
                        <Flame key={i} className="w-3 h-3" />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No items found matching your filters.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-secondary" /> Specials
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src="/images/biryani.png" className="w-16 h-16 rounded-md object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">Biryani Combo</h4>
                      <p className="text-xs text-muted-foreground">With raita & salan</p>
                      <span className="text-sm font-bold text-primary">$16.99</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="/images/samosa.png" className="w-16 h-16 rounded-md object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">Snack Box</h4>
                      <p className="text-xs text-muted-foreground">4 samosas, chutney</p>
                      <span className="text-sm font-bold text-primary">$8.99</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-secondary text-white hover:bg-secondary/90">Add All to Cart</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2 text-foreground">Family Meals</h3>
                <p className="text-sm text-muted-foreground mb-4">Feeding a group? Check out our family trays and large portions.</p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">View Trays</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
