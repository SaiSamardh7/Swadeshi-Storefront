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
  useGetMe,
  useGetMenuState,
  getGetMenuStateQueryKey,
  type Order,
} from "@workspace/api-client-react";

function formatPickupTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, subtotalCents, clearCart } = useCart();
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: menuState } = useGetMenuState({
    query: { queryKey: getGetMenuStateQueryKey(), retry: false },
  });
  const orderingPaused = menuState?.orderingPaused ?? false;
  const createOrder = useCreateOrder();

  const [pickupName, setPickupName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!meLoading && !me?.user) {
      navigate("/login?next=/checkout");
    }
  }, [meLoading, me, navigate]);

  if (placedOrder) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Order placed!</h1>
        <p className="text-muted-foreground mb-1">Order #{placedOrder.id}</p>
        <p className="text-lg font-semibold mb-4">
          Ready for pickup by {formatPickupTime(placedOrder.pickupEta)}
        </p>
        <p className="text-sm text-muted-foreground mb-6">Pay at pickup — no online payment required.</p>
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!pickupName.trim()) {
      setError("Enter a name for the order.");
      return;
    }
    createOrder.mutate(
      {
        data: {
          pickupName: pickupName.trim(),
          note: note.trim() || undefined,
          items: items.map((i) => ({ itemId: i.id, qty: i.quantity })),
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          setPlacedOrder(order);
        },
        onError: (err) => {
          // The API returns { error } with a human-readable reason (item sold
          // out, ordering paused) — show it instead of a generic message.
          const serverMessage = (err as { data?: { error?: string } })?.data?.error;
          setError(serverMessage ?? "Couldn't place the order. Please try again.");
        },
      },
    );
  }

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
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <span>Subtotal</span>
          <span>{formatCents(subtotalCents)}</span>
        </div>
      </Card>

      {orderingPaused && (
        <p className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
          Online ordering is paused right now — please call the store to order.
        </p>
      )}

      <p className="mb-6 rounded-lg bg-muted p-3 text-sm">
        Pickup in-store in about <strong>30 minutes</strong>. Pay at pickup — no card details needed here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pickupName" className="mb-1 block text-sm font-medium">
            Name for pickup
          </label>
          <Input
            id="pickupName"
            value={pickupName}
            onChange={(e) => setPickupName(e.target.value)}
            placeholder="Your name"
            autoFocus
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
            placeholder="Extra spicy, no onions, etc."
            rows={3}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={createOrder.isPending || orderingPaused}
        >
          {orderingPaused
            ? "Ordering paused"
            : createOrder.isPending
              ? "Placing order…"
              : `Place order — ${formatCents(subtotalCents)}`}
        </Button>
      </form>
    </div>
  );
}
