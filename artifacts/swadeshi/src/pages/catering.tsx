import { useMemo, useState } from "react";
import { Users, MapPin, UtensilsCrossed, PartyPopper, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/business";
import { formatCents } from "@/lib/utils";
import { VegDot } from "@/components/veg-dot";
import {
  CATERING_TRAYS,
  trayPriceCents,
  trayServes,
  type CateringTray,
  type TraySize,
} from "@workspace/menu";
import { useCreateCateringRequest, type CateringRequest } from "@workspace/api-client-react";

type QuoteLine = { trayId: string; size: TraySize; qty: number };

const EVENT_TYPES = [
  "Wedding / Reception",
  "Corporate Lunch / Dinner",
  "Festival / Puja",
  "Graduation",
  "Private Party / Family",
  "Other",
];

const TRAY_CATEGORIES = [...new Set(CATERING_TRAYS.map((t) => t.category))];

export default function Catering() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [diet, setDiet] = useState<"all" | "veg">("all");
  const [guestCount, setGuestCount] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventType: EVENT_TYPES[0],
    note: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<CateringRequest | null>(null);

  const createRequest = useCreateCateringRequest();

  const trayById = useMemo(() => new Map(CATERING_TRAYS.map((t) => [t.id, t])), []);

  const visibleTrays = CATERING_TRAYS.filter((t) => diet === "all" || t.isVeg);

  function qtyOf(trayId: string, size: TraySize): number {
    return lines.find((l) => l.trayId === trayId && l.size === size)?.qty ?? 0;
  }

  function changeQty(trayId: string, size: TraySize, delta: number) {
    setLines((prev) => {
      const existing = prev.find((l) => l.trayId === trayId && l.size === size);
      if (!existing) return delta > 0 ? [...prev, { trayId, size, qty: delta }] : prev;
      const qty = existing.qty + delta;
      if (qty <= 0) return prev.filter((l) => !(l.trayId === trayId && l.size === size));
      return prev.map((l) => (l.trayId === trayId && l.size === size ? { ...l, qty } : l));
    });
  }

  const estimateCents = lines.reduce((sum, line) => {
    const tray = trayById.get(line.trayId);
    return tray ? sum + trayPriceCents(tray, line.size) * line.qty : sum;
  }, 0);

  // Rough capacity of what's been selected, so a customer can sanity-check
  // their tray count against the headcount they typed in.
  const totalServes = lines.reduce((sum, line) => {
    const tray = trayById.get(line.trayId);
    return tray ? sum + trayServes(tray, line.size) * line.qty : sum;
  }, 0);

  const guests = Number.parseInt(guestCount, 10);
  const guestsValid = Number.isFinite(guests) && guests > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError("Pick at least one tray to build your quote.");
      return;
    }
    if (!guestsValid) {
      setError("Enter how many guests you're expecting.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.eventDate) {
      setError("Please fill in your name, phone, email, and event date.");
      return;
    }

    createRequest.mutate(
      {
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          eventDate: form.eventDate,
          eventType: form.eventType,
          guestCount: guests,
          note: form.note.trim() || undefined,
          items: lines,
        },
      },
      {
        onSuccess: (request) => setSubmitted(request),
        onError: (err) => {
          const serverMessage = (err as { data?: { error?: string } })?.data?.error;
          setError(serverMessage ?? "Couldn't send your request. Please call us instead.");
        },
      },
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">Quote request sent!</h1>
        <p className="mb-2 text-muted-foreground">Reference #{submitted.id}</p>
        <p className="mb-6 text-lg">
          Your estimate came to <strong>{formatCents(submitted.estimateCents)}</strong> for{" "}
          {submitted.guestCount} guests.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          This is an estimate, not a final quote. Our team will call you at {submitted.phone} to
          confirm tray sizes, pricing, and availability for {submitted.eventDate}.
        </p>
        <Button asChild className="rounded-full">
          <a href={BUSINESS.phoneTel}>Call us now</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Hero */}
      <div className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-black">
        <img
          src="/images/catering-hero.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          alt="Catering"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-3xl px-4 text-center text-white">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-primary">
            Swadeshi Catering
          </span>
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">Build Your Catering Quote</h1>
          <p className="mb-8 text-lg opacity-90">
            Pick your trays, tell us about your event, and get an instant estimate.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" /> Menu Planning
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Group Orders
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Frisco Pickup
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        {/* Events */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-bold">Events We Cater</h2>
          <p className="text-muted-foreground">
            From intimate family pujas to grand wedding receptions, we bring the authentic taste of
            home to your celebrations.
          </p>
        </div>
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { title: "Weddings", icon: PartyPopper },
            { title: "Corporate", icon: Users },
            { title: "Festivals/Pujas", icon: UtensilsCrossed },
            { title: "Graduations", icon: PartyPopper },
          ].map((event) => (
            <Card key={event.title} className="border-none bg-muted/50 text-center shadow-sm">
              <CardContent className="p-6">
                <event.icon className="mx-auto mb-3 h-8 w-8 text-secondary" />
                <h3 className="font-semibold">{event.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
          {/* Tray picker */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-bold">Choose Your Trays</h2>
              <div className="flex gap-1 rounded-full border p-1" role="group" aria-label="Diet filter">
                {(["all", "veg"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(d)}
                    aria-pressed={diet === d}
                    className={`rounded-full px-4 py-1 text-sm font-medium capitalize transition-colors ${
                      diet === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {d === "all" ? "All" : "Veg only"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {TRAY_CATEGORIES.map((category) => {
                const trays = visibleTrays.filter((t) => t.category === category);
                if (trays.length === 0) return null;
                return (
                  <div key={category}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {category}
                    </h3>
                    <ul className="space-y-3">
                      {trays.map((tray) => (
                        <TrayRow key={tray.id} tray={tray} qtyOf={qtyOf} changeQty={changeQty} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote summary + details form */}
          <div className="lg:sticky lg:top-20">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border bg-card p-5 shadow-xl md:p-6"
            >
              <h2 className="mb-1 text-2xl font-bold">Your Quote</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                An estimate we confirm by phone — not a final price.
              </p>

              {lines.length === 0 ? (
                <p className="mb-5 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  No trays selected yet. Add trays from the list to build your quote.
                </p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {lines.map((line) => {
                    const tray = trayById.get(line.trayId);
                    if (!tray) return null;
                    return (
                      <li key={`${line.trayId}-${line.size}`} className="flex items-start justify-between gap-2 text-sm">
                        <span className="min-w-0">
                          {line.qty}× {tray.name}
                          <span className="text-muted-foreground"> ({line.size} tray)</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="font-medium">
                            {formatCents(trayPriceCents(tray, line.size) * line.qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(line.trayId, line.size, -line.qty)}
                            aria-label={`Remove ${tray.name} ${line.size} tray`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {lines.length > 0 && (
                <div className="mb-5 border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Estimate</span>
                    <span>{formatCents(estimateCents)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Feeds roughly {totalServes} people
                    {guestsValid && totalServes < guests && (
                      <span className="text-destructive">
                        {" "}
                        — that's under your {guests} guests, consider adding more
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="guests" className="mb-1 block text-sm font-medium">
                    Number of guests *
                  </label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    placeholder="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      Name *
                    </label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                      Phone *
                    </label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="eventDate" className="mb-1 block text-sm font-medium">
                      Event date *
                    </label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="eventType" className="mb-1 block text-sm font-medium">
                      Event type *
                    </label>
                    <select
                      id="eventType"
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="note" className="mb-1 block text-sm font-medium">
                    Anything else?
                  </label>
                  <Textarea
                    id="note"
                    rows={3}
                    className="resize-none"
                    placeholder="Spice level, allergies, delivery vs pickup, venue details…"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                size="lg"
                className="mt-4 h-12 w-full rounded-xl text-base"
                disabled={createRequest.isPending}
              >
                {createRequest.isPending ? "Sending…" : "Send quote request"}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                We'll call to confirm exact pricing and availability.
              </p>
              <Button variant="outline" className="mt-3 w-full rounded-xl" asChild>
                <a href={BUSINESS.phoneTel}>Or call us directly</a>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrayRow({
  tray,
  qtyOf,
  changeQty,
}: {
  tray: CateringTray;
  qtyOf: (trayId: string, size: TraySize) => number;
  changeQty: (trayId: string, size: TraySize, delta: number) => void;
}) {
  return (
    <li className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <VegDot isVeg={tray.isVeg} />
        <h4 className="flex-1 font-semibold">{tray.name}</h4>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["half", "full"] as const).map((size) => {
          const qty = qtyOf(tray.id, size);
          return (
            <div
              key={size}
              className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 ${qty > 0 ? "border-primary bg-primary/5" : ""}`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium capitalize">{size} tray</p>
                <p className="text-xs text-muted-foreground">
                  {formatCents(trayPriceCents(tray, size))} · serves ~{trayServes(tray, size)}
                </p>
              </div>
              {qty === 0 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 shrink-0 rounded-full"
                  onClick={() => changeQty(tray.id, size, 1)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              ) : (
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full"
                    aria-label={`Remove one ${tray.name} ${size} tray`}
                    onClick={() => changeQty(tray.id, size, -1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                  <Button
                    type="button"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    aria-label={`Add one ${tray.name} ${size} tray`}
                    onClick={() => changeQty(tray.id, size, 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </li>
  );
}
