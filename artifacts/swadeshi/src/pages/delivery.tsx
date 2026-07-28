import { Link } from "wouter";
import {
  MapPin,
  Clock,
  Truck,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BUSINESS } from "@/lib/business";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Build your order",
    body: "Browse the full kitchen menu and add your favorites to the cart.",
  },
  {
    icon: MapPin,
    title: "Address & time",
    body: "Enter your address — we confirm you're within 5 miles and show scheduled delivery windows.",
  },
  {
    icon: Truck,
    title: "We cook & deliver",
    body: "Pay securely online, and our own driver brings it hot to your door.",
  },
];

const PERKS = [
  {
    icon: MapPin,
    title: "Within 5 miles",
    body: `We deliver within 5 miles of ${BUSINESS.shortName} Plaza in ${BUSINESS.city}.`,
  },
  {
    icon: Clock,
    title: "Scheduled slots",
    body: "Pick a delivery window that fits your day, not just “as soon as possible.”",
  },
  {
    icon: CreditCard,
    title: "Prepaid & simple",
    body: "Pay online at checkout. A small delivery fee and order minimum apply — shown before you pay.",
  },
  {
    icon: ShieldCheck,
    title: "Our own drivers",
    body: "Delivered by our own team, so your food arrives the way we made it.",
  },
];

export default function Delivery() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero */}
      <section className="relative bg-muted py-20 px-4 overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-secondary">
                Within 5 miles
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-secondary">
                Scheduled times
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold shadow-sm text-secondary">
                Our own drivers
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Indian food, <span className="text-primary">delivered</span> to your door
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Order from our full kitchen menu and we'll bring it to you — within 5 miles of{" "}
              {BUSINESS.city}, at a time you choose.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/menu">Start your order</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary/10"
                asChild
              >
                <a href={BUSINESS.phoneTel}>Call the store</a>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img
              src="/images/thali.jpg"
              alt="A full Indian thali ready for delivery"
              className="relative z-10 rounded-2xl shadow-2xl object-cover aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">How delivery works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Card key={step.title} className="border-none shadow-sm h-full">
                <CardContent className="p-6 flex flex-col">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 container mx-auto">
        <div className="grid gap-6 sm:grid-cols-2">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex gap-4 rounded-2xl border bg-card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <perk.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold mb-1">{perk.title}</h3>
                <p className="text-sm text-muted-foreground">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 px-4 container mx-auto">
        <Card className="overflow-hidden border-none shadow-md bg-muted">
          <CardContent className="p-0 grid md:grid-cols-2">
            <div className="h-48 md:h-full bg-card flex items-center justify-center border-b md:border-b-0 md:border-r">
              <MapPin className="h-12 w-12 text-primary/40" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2">Are you in range?</h2>
              <p className="text-muted-foreground mb-4">
                We deliver within 5 miles of our {BUSINESS.city} store. Enter your address at
                checkout and we'll instantly tell you if you're covered — and show your delivery fee
                and available times.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {BUSINESS.address}
                <br />
                {BUSINESS.hoursShort}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-full" asChild>
                  <Link href="/menu">Check my address</Link>
                </Button>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/location">
                    All locations <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Closing CTA */}
      <section className="py-16 px-4 container mx-auto">
        <Card className="overflow-hidden border-none shadow-md bg-secondary text-secondary-foreground relative">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/images/biryani.jpg')] bg-cover bg-center" />
          <CardContent className="p-10 relative z-10 text-center flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-3">Hungry? Let's get you fed.</h2>
            <p className="mb-8 opacity-90 max-w-md">
              Build your cart, pick a time, and we'll handle the rest. Prefer to grab it yourself?
              Pickup is always an option at checkout.
            </p>
            <Button className="bg-white text-secondary hover:bg-white/90 rounded-full px-8" asChild>
              <Link href="/menu">Start your delivery order</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
