import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, MapPin, UtensilsCrossed, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUSINESS } from "@/lib/business";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  date: z.string().min(1, "Date is required"),
  guests: z.string().min(1, "Guest count required"),
  eventType: z.string().min(1, "Event type required"),
  message: z.string().optional(),
});

const TRAY_ITEMS = [
  { name: "Chicken Biryani", img: "/images/biryani.jpg" },
  { name: "Paneer Butter Masala", img: "/images/paneer.jpg" },
  { name: "Samosa Platters", img: "/images/samosa.jpg" },
  { name: "Traditional Sweets", img: "/images/sweets.jpg" },
];

export default function Catering() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      guests: "",
      eventType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = `Catering inquiry: ${values.eventType}`;
    const body = [
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Event date: ${values.date}`,
      `Guest count: ${values.guests}`,
      `Event type: ${values.eventType}`,
      "",
      values.message || "No additional details provided.",
    ].join("\n");

    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <img src="/images/catering-hero.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Catering" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <span className="uppercase tracking-widest text-sm font-semibold text-primary mb-4 block">Swadeshi Catering</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Make Your Event Memorable</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">Authentic Indian cuisine for weddings, corporate events, and family gatherings. Call or email to confirm menu, availability, and service options.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2"><UtensilsCrossed className="w-5 h-5 text-primary" /> Menu Planning</span>
            <span className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Group Orders</span>
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Frisco Pickup</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Events Row */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Events We Cater</h2>
          <p className="text-muted-foreground">From intimate family pujas to grand wedding receptions, we bring the authentic taste of home to your celebrations.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { title: "Weddings", icon: PartyPopper },
            { title: "Corporate", icon: Users },
            { title: "Festivals/Pujas", icon: UtensilsCrossed },
            { title: "Graduations", icon: PartyPopper }
          ].map(event => (
            <Card key={event.title} className="text-center border-none shadow-sm bg-muted/50 hover:bg-muted transition-colors">
              <CardContent className="p-6">
                <event.icon className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold">{event.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Party Trays */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Popular Party Trays</h2>
            <p className="text-muted-foreground mb-8">These are popular catering ideas. Call the store to confirm current tray sizes, pricing, lead time, and availability.</p>
            
            <div className="space-y-4">
              {TRAY_ITEMS.map((tray, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4">
                    <img src={tray.img} className="w-24 h-24 rounded-lg object-cover" alt={tray.name} />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-lg">{tray.name}</h3>
                      <p className="text-sm text-muted-foreground">Sizes and pricing available by phone.</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6 border-primary text-primary hover:bg-primary/10" asChild>
              <a href={BUSINESS.phoneTel}>Call About Catering</a>
            </Button>
          </div>

          {/* Form */}
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-2">Inquire About Catering</h2>
            <p className="text-muted-foreground text-sm mb-6">Prepare an email with your event details, then review and send it from your email app.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl><Input placeholder="(555) 000-0000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date *</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="guests" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Count *</FormLabel>
                        <FormControl><Input type="number" placeholder="50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="eventType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding / Reception</SelectItem>
                          <SelectItem value="corporate">Corporate Lunch / Dinner</SelectItem>
                          <SelectItem value="private">Private Party / Family</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about dietary restrictions, favorite dishes, or venue details..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg rounded-xl mt-4">
                    Open Catering Email Draft
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This opens your email app. The website does not store or send your details itself.
                  </p>
                </form>
              </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
