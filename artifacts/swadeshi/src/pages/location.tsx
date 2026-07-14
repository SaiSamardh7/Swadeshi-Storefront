import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BUSINESS, LOCATIONS } from "@/lib/business";

const otherLocations = LOCATIONS.filter((l) => !l.isPrimary);

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
            Open Daily
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Locations & Hours</h1>
          <p className="text-lg text-muted-foreground">
            Visit our flagship store in Frisco, or find us at four more locations across the Dallas–Fort Worth metroplex.
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
                    <span>{BUSINESS.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a href={BUSINESS.phoneTel} className="hover:text-primary transition-colors">{BUSINESS.phoneDisplay}</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary transition-colors">{BUSINESS.email}</a>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      {BUSINESS.hours.map((h) => (
                        <span key={h} className="block">{h}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white" asChild>
                    <a href={BUSINESS.phoneTel}>Call Now</a>
                  </Button>
                  <Button className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10" variant="outline" asChild>
                    <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">Directions</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Locations */}
            <Card className="border shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">More Swadeshi Locations</h3>
                <ul className="space-y-4">
                  {otherLocations.map((loc) => (
                    <li key={loc.name} className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-medium text-foreground">{loc.name}</span>
                          <span className="block text-sm">{loc.area}</span>
                        </div>
                      </div>
                      <Button variant="link" className="px-0 text-primary shrink-0" asChild>
                        <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer">Map →</a>
                      </Button>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">Open the map listing for the current address, hours, and contact details.</p>
              </CardContent>
            </Card>
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[600px] border">
            <iframe
              title="Swadeshi Frisco Location"
              src={BUSINESS.mapsEmbed}
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
