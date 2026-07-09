import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground">
            Bringing the authentic taste of home to the heart of Texas.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg mx-auto">
          <p className="mb-6">
            Swadeshi started with a simple vision: to create a true one-stop destination for the community. We wanted a place where you could pick up your daily groceries, select the freshest halal meats, and sit down for an authentic, comforting Indian meal—all under one roof.
          </p>
          <p className="mb-6">
            Located primarily in Frisco, TX, with our reach expanding across the region, we pride ourselves on quality and authenticity. Our grocery shelves are stocked with premium spices, lentils, and everyday essentials. Our halal butcher shop ensures the highest standards of freshness and certification. And our quick-service kitchen serves up traditional recipes made from scratch daily.
          </p>
          <p className="mb-8">
            Whether you're stopping by for a quick lunch, planning your weekly family dinners, or organizing a catering spread for a milestone event, Swadeshi is here to serve you with warmth and tradition. Welcome to our kitchen.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button size="lg" className="rounded-full px-8" asChild>
            <Link href="/menu">View Menu</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <a href="https://www.google.com/maps?q=Frisco,TX" target="_blank" rel="noopener noreferrer">Get Directions</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
