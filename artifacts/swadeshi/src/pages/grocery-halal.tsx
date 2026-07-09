import React from 'react';
import { ShoppingCart, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";

const GROCERY_CATEGORIES = [
  { id: "g1", name: "Premium Basmati Rice (10lb)", price: 18.99, img: "/images/grocery-hero.png" },
  { id: "g2", name: "Aashirvaad Atta (20lb)", price: 14.99, img: "/images/grocery-hero.png" },
  { id: "g3", name: "Toor Dal (4lb)", price: 8.99, img: "/images/grocery-hero.png" },
  { id: "g4", name: "MDH Garam Masala", price: 3.49, img: "/images/grocery-hero.png" },
  { id: "g5", name: "Fresh Okra (per lb)", price: 2.99, img: "/images/grocery-hero.png" },
  { id: "g6", name: "Paneer Block", price: 7.99, img: "/images/grocery-hero.png" },
];

const HALAL_CATEGORIES = [
  { id: "h1", name: "Chicken Breast (Boneless)", price: 5.99, img: "/images/halal-hero.png", unit: "per lb" },
  { id: "h2", name: "Whole Chicken (Cut)", price: 3.49, img: "/images/halal-hero.png", unit: "per lb" },
  { id: "h3", name: "Goat Meat (Mixed Cuts)", price: 9.99, img: "/images/halal-hero.png", unit: "per lb" },
  { id: "h4", name: "Lamb Chops", price: 11.99, img: "/images/halal-hero.png", unit: "per lb" },
  { id: "h5", name: "Ground Beef", price: 6.99, img: "/images/halal-hero.png", unit: "per lb" },
  { id: "h6", name: "Beef Stew Meat", price: 7.49, img: "/images/halal-hero.png", unit: "per lb" },
];

export default function GroceryHalal() {
  const { addToCart } = useCart();

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Split Hero */}
      <div className="grid md:grid-cols-2 min-h-[40vh] md:min-h-[60vh]">
        <div className="relative group overflow-hidden bg-orange-900">
          <img src="/images/grocery-hero.png" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Grocery" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Desi Groceries</h1>
            <p className="text-lg opacity-90 mb-6">Spices, lentils, rice, and daily fresh vegetables.</p>
            <div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">Shop Groceries</Button>
            </div>
          </div>
        </div>
        
        <div className="relative group overflow-hidden bg-green-900">
          <img src="/images/halal-hero.png" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Halal Meat" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-4 right-4 bg-white text-secondary px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Halal Certified
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Fresh Halal Meat</h1>
            <p className="text-lg opacity-90 mb-6">Premium cuts of chicken, goat, lamb, and beef.</p>
            <div>
              <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full">Shop Halal Meat</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        
        {/* Grocery Section */}
        <section>
          <div className="flex items-end justify-between mb-8 pb-4 border-b-2 border-primary/20 relative">
            <h2 className="text-3xl font-bold">Everyday Grocery</h2>
            <div className="absolute bottom-0 left-0 h-1 w-24 bg-primary" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GROCERY_CATEGORIES.map(item => (
              <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
                <div className="h-32 bg-muted relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-2 flex-1">{item.name}</h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10" onClick={() => addToCart(item)}>
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Halal Meat Section */}
        <section>
          <div className="flex items-end justify-between mb-8 pb-4 border-b-2 border-secondary/20 relative">
            <h2 className="text-3xl font-bold">Halal Butcher</h2>
            <div className="absolute bottom-0 left-0 h-1 w-24 bg-secondary" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HALAL_CATEGORIES.map(item => (
              <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
                <div className="h-32 bg-muted relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-1 flex-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.unit}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-secondary">${item.price.toFixed(2)}</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-secondary hover:bg-secondary/10" onClick={() => addToCart(item)}>
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-y">
          {[
            "Fresh Selection Daily",
            "100% Halal Certified",
            "Quality Guaranteed",
            "Local Home Delivery",
            "Curbside Pickup"
          ].map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Info Blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-muted border-none shadow-none">
            <CardContent className="p-8 flex items-center gap-6">
              <Package className="w-16 h-16 text-primary" />
              <div>
                <h3 className="text-xl font-bold mb-2">Curbside Pickup</h3>
                <p className="text-muted-foreground text-sm">Order your groceries and meat online. We'll pack everything fresh and bring it directly to your car when you arrive.</p>
              </div>
            </CardContent>
          </Card>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src="/images/storefront.png" className="w-full h-full object-cover" alt="Store Location" />
          </div>
        </div>

      </div>
    </div>
  );
}
