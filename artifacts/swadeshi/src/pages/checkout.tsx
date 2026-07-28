import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { formatCents } from "@/lib/utils";
import {
  useCreateOrder,
  usePayOrder,
  useQuoteDelivery,
  useGetDeliverySlots,
  getGetDeliverySlotsQueryKey,
  useGetMe,
  useGetMenuState,
  getGetMenuStateQueryKey,
  type Order,
  type DeliveryQuote,
} from "@workspace/api-client-react";

const TZ = "America/Chicago";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
}

function formatSlot(startsAt: string, endsAt: string): string {
  const day = new Date(startsAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: TZ,
  });
  return `${day}, ${formatTime(startsAt)}–${formatTime(endsAt)}`;
}

function serverMessage(err: unknown): string | undefined {
  return (err as { data?: { error?: string } })?.data?.error;
}

type Mode = "pickup" | "delivery";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, subtotalCents, clearCart } = useCart();
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: menuState } = useGetMenuState({
    query: { queryKey: getGetMenuStateQueryKey(), retry: false },
  });
  const orderingPaused = menuState?.orderingPaused ?? false;

  const createOrder = useCreateOrder();
  const payOrder = usePayOrder();
  const quoteDelivery = useQuoteDelivery();

  const [mode, setMode] = useState<Mode>("pickup");
  const [pickupName, setPickupName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const [addr, setAddr] = useState({ line1: "", line2: "", city: "", state: "TX", zip: "" });
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: slots } = useGetDeliverySlots({
    query: {
      queryKey: getGetDeliverySlotsQueryKey(),
      enabled: mode === "delivery" && Boolean(quote?.eligible),
      retry: false,
    },
  });

  useEffect(() => {
    if (!meLoading && !me?.user) navigate("/login?next=/checkout");
  }, [meLoading, me, navigate]);

  const busy = createOrder.isPending || payOrder.isPending;

  function updateAddr(field: keyof typeof addr, value: string) {
    setAddr((prev) => ({ ...prev, [field]: value }));
    // Any address edit invalidates a prior quote/slot.
    setQuote(null);
    setSelectedSlot(null);
  }

  const addressComplete =
    addr.line1.trim() && addr.city.trim() && addr.state.trim() && addr.zip.trim().length >= 5;

  function handleCheckAddress() {
    setError(null);
    quoteDelivery.mutate(
      {
        data: {
          line1: addr.line1.trim(),
          line2: addr.line2.trim() || undefined,
          city: addr.city.trim(),
          state: addr.state.trim(),
          zip: addr.zip.trim(),
        },
      },
      {
        onSuccess: (q) => {
          setQuote(q);
          setSelectedSlot(null);
        },
        onError: (err) => {
          setQuote(null);
          setError(serverMessage(err) ?? "We couldn't check that address. Try again.");
        },
      },
    );
  }

  function finish(order: Order) {
    clearCart();
    setPlacedOrder(order);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!pickupName.trim()) {
      setError("Enter a name for the order.");
      return;
    }
    const baseItems = items.map((i) => ({ itemId: i.id, qty: i.quantity }));

    if (mode === "delivery") {
      if (!quote?.eligible || !selectedSlot) {
        setError("Check your address and pick a delivery time.");
        return;
      }
      createOrder.mutate(
        {
          data: {
            fulfillmentType: "delivery",
            pickupName: pickupName.trim(),
            note: note.trim() || undefined,
            address: {
              line1: addr.line1.trim(),
              line2: addr.line2.trim() || undefined,
              city: addr.city.trim(),
              state: addr.state.trim(),
              zip: addr.zip.trim(),
            },
            scheduledFor: selectedSlot,
            items: baseItems,
          },
        },
        {
          onSuccess: (order) => {
            // Prepay immediately (stub gateway today).
            payOrder.mutate(
              { id: order.id },
              {
                onSuccess: (paid) => finish(paid),
                onError: (err) =>
                  setError(serverMessage(err) ?? "Order placed but payment failed. Please call the store."),
              },
            );
          },
          onError: (err) => setError(serverMessage(err) ?? "Couldn't place the order. Please try again."),
        },
      );
      return;
    }

    createOrder.mutate(
      {
        data: {
          fulfillmentType: "pickup",
          pickupName: pickupName.trim(),
          note: note.trim() || undefined,
          items: baseItems,
        },
      },
      {
        onSuccess: (order) => finish(order),
        onError: (err) => setError(serverMessage(err) ?? "Couldn't place the order. Please try again."),
      },
    );
  }

  // ------------------------------------------------------------ Confirmation
  if (placedOrder) {
    const isDelivery = placedOrder.fulfillmentType === "delivery";
    const total = placedOrder.subtotalCents + (placedOrder.delivery?.deliveryFeeCents ?? 0);
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">{isDelivery ? "Delivery scheduled!" : "Order placed!"}</h1>
        <p className="text-muted-foreground mb-1">Order #{placedOrder.id}</p>
        {isDelivery ? (
          <>
            <p className="text-lg font-semibold mb-1">
              Arriving{" "}
              {placedOrder.scheduledFor
                ? new Date(placedOrder.scheduledFor).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: TZ,
                  })
                : "soon"}
            </p>
            <p className="text-muted-foreground mb-1">
              {placedOrder.delivery?.line1}, {placedOrder.delivery?.city} {placedOrder.delivery?.zip}
            </p>
            <p className="text-lg font-semibold mb-4">Paid {formatCents(total)}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold mb-4">
              Ready for pickup by {placedOrder.pickupEta ? formatTime(placedOrder.pickupEta) : "soon"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">Pay at pickup — no online payment required.</p>
          </>
        )}
        <Button asChild className="rounded-full">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Button asChild className="rounded-full">
          <Link href="/menu">Browse the menu</Link>
        </Button>
      </div>
    );
  }

  const deliveryFee = quote?.eligible ? quote.deliveryFeeCents : 0;
  const minMet = !quote?.eligible || subtotalCents >= quote.minimumOrderCents;
  const total = subtotalCents + (mode === "delivery" ? deliveryFee : 0);
  const canPlace =
    !orderingPaused &&
    !busy &&
    (mode === "pickup" || (Boolean(quote?.eligible) && Boolean(selectedSlot) && minMet));

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <Card className="p-4 mb-6">
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatCents(item.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          {mode === "delivery" && quote?.eligible && (
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{formatCents(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>{formatCents(total)}</span>
          </div>
        </div>
      </Card>

      {orderingPaused && (
        <p className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
          Online ordering is paused right now — please call the store to order.
        </p>
      )}

      {/* Fulfillment toggle */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {(["pickup", "delivery"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
              mode === m ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "pickup" ? (
        <p className="mb-6 rounded-lg bg-muted p-3 text-sm">
          Pickup in-store in about <strong>30 minutes</strong>. Pay at pickup — no card details needed here.
        </p>
      ) : (
        <div className="mb-6 space-y-4">
          <div className="rounded-lg bg-muted p-3 text-sm">
            We deliver within <strong>5 miles</strong> of the store. Enter your address to see availability and fee.
          </div>

          <div className="space-y-2">
            <Input
              value={addr.line1}
              onChange={(e) => updateAddr("line1", e.target.value)}
              placeholder="Street address"
              aria-label="Street address"
            />
            <Input
              value={addr.line2}
              onChange={(e) => updateAddr("line2", e.target.value)}
              placeholder="Apt / suite (optional)"
              aria-label="Apartment or suite"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={addr.city}
                onChange={(e) => updateAddr("city", e.target.value)}
                placeholder="City"
                aria-label="City"
                className="col-span-1"
              />
              <Input
                value={addr.state}
                onChange={(e) => updateAddr("state", e.target.value)}
                placeholder="State"
                aria-label="State"
              />
              <Input
                value={addr.zip}
                onChange={(e) => updateAddr("zip", e.target.value)}
                placeholder="ZIP"
                aria-label="ZIP code"
                inputMode="numeric"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              disabled={!addressComplete || quoteDelivery.isPending}
              onClick={handleCheckAddress}
            >
              {quoteDelivery.isPending ? "Checking…" : "Check delivery availability"}
            </Button>
          </div>

          {quote && !quote.eligible && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
              That address is outside our 5-mile delivery range. Pickup is still available.
            </p>
          )}

          {quote?.eligible && (
            <>
              {!minMet && (
                <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  Delivery has a {formatCents(quote.minimumOrderCents)} minimum. Add{" "}
                  {formatCents(quote.minimumOrderCents - subtotalCents)} more to your cart.
                </p>
              )}
              <div>
                <p className="mb-2 text-sm font-medium">Choose a delivery time</p>
                {slots && slots.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {slots.map((s) => (
                      <button
                        key={s.startsAt}
                        type="button"
                        onClick={() => setSelectedSlot(s.startsAt)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          selectedSlot === s.startsAt
                            ? "border-primary bg-primary/10"
                            : "hover:bg-accent"
                        }`}
                      >
                        {formatSlot(s.startsAt, s.endsAt)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No delivery windows are available right now. Try pickup, or check back later.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pickupName" className="mb-1 block text-sm font-medium">
            {mode === "delivery" ? "Name for delivery" : "Name for pickup"}
          </label>
          <Input
            id="pickupName"
            value={pickupName}
            onChange={(e) => setPickupName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="note" className="mb-1 block text-sm font-medium">
            Note (optional)
          </label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Extra spicy, no onions, gate code, etc."
            rows={3}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={!canPlace}>
          {orderingPaused
            ? "Ordering paused"
            : busy
              ? "Placing order…"
              : mode === "delivery"
                ? `Place delivery order — ${formatCents(total)}`
                : `Place order — ${formatCents(total)}`}
        </Button>
      </form>
    </div>
  );
}
