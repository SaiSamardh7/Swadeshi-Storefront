import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export default function Reviews() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
          <p className="text-lg text-muted-foreground">
            Read current feedback from customers or share your experience on Google.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <Star className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">See Verified, Current Feedback</h2>
            <p className="text-muted-foreground mb-8">
              Reviews change over time, so we link directly to the store's Google listing instead of republishing selected testimonials here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">View Google Listing</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/contact"><MessageSquare className="w-4 h-4 mr-2" />Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
