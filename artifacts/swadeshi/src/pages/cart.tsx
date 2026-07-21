import { Link } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { formatCents } from "@/lib/utils";
import { useGetMe } from "@workspace/api-client-react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotalCents } = useCart();
  const { data: me } = useGetMe();
  const checkoutHref = me?.user ? "/checkout" : "/login?next=/checkout";

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add something tasty from the menu.</p>
        <Button asChild className="rounded-full">
          <Link href="/menu">Browse the menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="flex items-center gap-3 p-3">
            {item.image && (
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">{formatCents(item.priceCents)} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                aria-label={`Remove ${item.name}`}
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-lg font-bold">
        <span>Subtotal</span>
        <span>{formatCents(subtotalCents)}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Pickup only · pay at pickup · ~30 min</p>

      <Button asChild size="lg" className="mt-6 w-full rounded-full">
        <Link href={checkoutHref}>Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
