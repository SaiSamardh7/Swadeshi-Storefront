import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
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
  reason: z.string().min(1, "Reason is required"),
  message: z.string().min(10, "Message is required"),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      reason: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = `Website inquiry: ${values.reason}`;
    const body = [
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Topic: ${values.reason}`,
      "",
      values.message,
    ].join("\n");

    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Reach out with any questions about our grocery selection, halal meat, kitchen menu, or catering services.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm">{BUSINESS.address}<br/>(Flagship Location)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    <a href="tel:+14692943500" className="hover:text-primary transition-colors">+1 (469) 294-3500</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    <a href="mailto:Spfrisco@gmail.com" className="hover:text-primary transition-colors">Spfrisco@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <p className="text-muted-foreground text-sm">{BUSINESS.hours.join(" · ")}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t flex flex-col gap-3">
              <Button className="w-full rounded-full" asChild>
                <a href="tel:+14692943500">Call Now</a>
              </Button>
              <Button variant="outline" className="w-full rounded-full" asChild>
                <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a>
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <FormField control={form.control} name="reason" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for inquiry *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="grocery">Grocery & Halal Meat</SelectItem>
                              <SelectItem value="kitchen">Kitchen / Restaurant Menu</SelectItem>
                              <SelectItem value="catering">Catering Inquiry</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can we help you?" className="resize-none h-32" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg rounded-xl mt-4">
                        Open Email Draft
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        This opens your email app. The website does not store or send your details itself.
                      </p>
                    </form>
                  </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
