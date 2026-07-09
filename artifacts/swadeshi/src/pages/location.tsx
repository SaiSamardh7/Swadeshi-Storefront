import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Location() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Open Now
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Locations & Hours</h1>
          <p className="text-lg text-muted-foreground">
            Visit our flagship store in Frisco or explore our growing presence across the McKinney and Plano area.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Our Stores</h2>
            
            {/* Primary Location */}
            <Card className="border-2 border-primary/20 shadow-md">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">Frisco (Flagship)</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Primary</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Frisco, TX<br/>(Serving the greater Frisco area)</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a href="tel:+14692943500" className="hover:text-primary transition-colors">+1 (469) 294-3500</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a href="mailto:Spfrisco@gmail.com" className="hover:text-primary transition-colors">Spfrisco@gmail.com</a>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block">Mon-Sat: 9:00 AM - 10:00 PM</span>
                      <span className="block">Sun: 10:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white" asChild>
                    <a href="tel:+14692943500">Call Now</a>
                  </Button>
                  <Button className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10" variant="outline" asChild>
                    <a href="https://www.google.com/maps?q=Frisco,TX" target="_blank" rel="noopener noreferrer">Directions</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Locations Generic */}
            <Card className="border shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Other Serving Areas</h3>
                <p className="text-muted-foreground mb-4">
                  We also serve the Allen, McKinney, and Plano areas. Stop by our flagship store in Frisco or look out for our nearby locations.
                </p>
                <Button variant="link" className="px-0 text-primary" asChild>
                  <a href="https://www.google.com/maps?q=Allen,TX" target="_blank" rel="noopener noreferrer">View on Map →</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[600px] border">
            <iframe 
              title="Swadeshi Frisco Location"
              src="https://www.google.com/maps?q=Frisco,TX&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
