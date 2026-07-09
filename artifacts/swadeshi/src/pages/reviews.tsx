import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, UtensilsCrossed, ShoppingBag, Heart, BadgeCheck } from "lucide-react";

const REVIEWS = [
  {
    icon: UtensilsCrossed,
    title: "Authentic Flavors",
    testimonial: "The biryani here tastes exactly like back home. Highly recommend the quick-service kitchen for lunch!",
    author: "Sample Feedback"
  },
  {
    icon: BadgeCheck,
    title: "Fresh Halal Meat",
    testimonial: "Best halal butcher in the Frisco area. The cuts are always fresh and the staff is very accommodating to specific requests.",
    author: "Sample Feedback"
  },
  {
    icon: ShoppingBag,
    title: "Well-Stocked Grocery",
    testimonial: "I can find all the spices and lentils I need here. It's so convenient to do my grocery shopping while picking up dinner.",
    author: "Sample Feedback"
  },
  {
    icon: Heart,
    title: "Great for Catering",
    testimonial: "We ordered catering for a family event and everything was perfect. The paneer and samosas were a huge hit with all our guests.",
    author: "Sample Feedback"
  },
  {
    icon: MessageSquare,
    title: "Friendly Service",
    testimonial: "The staff is incredibly welcoming and helpful. They always greet you with a smile and help you find what you need.",
    author: "Sample Feedback"
  },
  {
    icon: Star,
    title: "Incredible Sweets",
    testimonial: "Their gulab jamun and fresh jalebi are simply amazing. I always grab a box before leaving.",
    author: "Sample Feedback"
  }
];

export default function Reviews() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
          <p className="text-lg text-muted-foreground">
            See what our community has to say about their experience at Swadeshi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <review.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg">{review.title}</h3>
                </div>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">"{review.testimonial}"</p>
                <p className="text-sm font-medium text-foreground/70">— {review.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 mb-8">
        <Card className="bg-secondary text-secondary-foreground border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Star className="w-64 h-64" />
          </div>
          <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-secondary-foreground/80 text-lg">
                Your feedback helps us continue to improve and serve our community better. We'd love to hear about your recent visit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90 rounded-full px-8" asChild>
                <a href="https://www.google.com/maps/search/Swadeshi+Frisco+TX" target="_blank" rel="noopener noreferrer">
                  Leave a Review
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
