import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/business";

const GALLERY_IMAGES = [
  { src: "/images/storefront.jpg", alt: "Swadeshi Storefront Exterior", caption: "Welcome to Swadeshi" },
  { src: "/images/grocery-aisle.jpg", alt: "Grocery Aisles", caption: "Premium Quality Groceries" },
  { src: "/images/halal-case.jpg", alt: "Halal Meat Case", caption: "Fresh Halal Butcher Shop" },
  { src: "/images/catering-hero.jpg", alt: "Catering Spread", caption: "Authentic Catering Spreads" },
  { src: "/images/biryani.jpg", alt: "Chicken Biryani", caption: "Signature Chicken Biryani" },
  { src: "/images/paneer.jpg", alt: "Paneer Butter Masala", caption: "Rich Paneer Curries" },
  { src: "/images/sweets.jpg", alt: "Traditional Sweets", caption: "Freshly Made Sweets" },
  { src: "/images/dosa.jpg", alt: "Masala Dosa", caption: "Crispy South Indian Dosas" },
];

export default function Gallery() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Photo Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Take a visual tour of our store, fresh products, and authentic dishes prepared daily.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mb-8 text-center max-w-2xl bg-primary/5 rounded-3xl p-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Hungry?</h2>
        <p className="text-muted-foreground mb-8">
          Order our delicious, authentic Indian cuisine online for pickup or delivery.
        </p>
        <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white" asChild>
          <a href={BUSINESS.orderUrl} target="_blank" rel="noopener noreferrer">Order Online Now</a>
        </Button>
      </div>
    </div>
  );
}
