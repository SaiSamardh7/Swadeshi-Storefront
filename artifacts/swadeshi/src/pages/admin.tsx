import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FULL_MENU, menuItemId } from "@workspace/menu";
import {
  useAdminLogin,
  useAdminLogout,
  useGetAdminOrders,
  useUpdateOrderStatus,
  useGetMenuState,
  useUpdateMenuOverride,
  useUpdateStoreState,
  useGetAdminCateringRequests,
  useUpdateCateringStatus,
  useGetAdminDrivers,
  useCreateDriver,
  useUpdateOrderDelivery,
  getGetAdminOrdersQueryKey,
  getGetMenuStateQueryKey,
  getGetAdminCateringRequestsQueryKey,
  getGetAdminDriversQueryKey,
  type Order,
  type OrderStatus,
  type MenuOverride,
  type CateringRequest,
  type CateringStatus,
  type Driver,
  type DeliveryStatus,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { formatCents } from "@/lib/utils";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: null,
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready for pickup",
  picked_up: "Picked up",
};

const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  unassigned: "Unassigned",
  assigned: "Assigned",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const DELIVERY_STATUS_FLOW: DeliveryStatus[] = [
  "unassigned",
  "assigned",
  "out_for_delivery",
  "delivered",
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

function chicagoDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

// ---------------------------------------------------------------------------
// Orders tab
// ---------------------------------------------------------------------------

function DeliveryControls({ order, drivers }: { order: Order; drivers: Driver[] }) {
  const update = useUpdateOrderDelivery();
  const delivery = order.delivery;
  if (!delivery) return null;

  function submit(driverId: number | null, deliveryStatus: DeliveryStatus) {
    update.mutate(
      { id: order.id, data: { driverId, deliveryStatus } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAdminOrdersQueryKey() }) },
    );
  }

  return (
    <div className="mt-3 rounded-lg border bg-muted/40 p-3 text-sm">
      <p className="font-medium">
        Deliver to {delivery.line1}
        {delivery.line2 ? `, ${delivery.line2}` : ""}, {delivery.city} {delivery.zip}
      </p>
      <p className="text-xs text-muted-foreground">
        {(delivery.distanceMeters / 1609.344).toFixed(1)} mi · fee {formatCents(delivery.deliveryFeeCents)}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground" htmlFor={`driver-${order.id}`}>
          Driver
        </label>
        <select
          id={`driver-${order.id}`}
          className="h-8 rounded-md border bg-background px-2 text-sm"
          value={delivery.driverId ?? ""}
          disabled={update.isPending}
          onChange={(e) => {
            const driverId = e.target.value ? Number(e.target.value) : null;
            const nextStatus: DeliveryStatus =
              driverId && delivery.deliveryStatus === "unassigned" ? "assigned" : delivery.deliveryStatus;
            submit(driverId, nextStatus);
          }}
        >
          <option value="">Unassigned</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {DELIVERY_STATUS_FLOW.map((s) => (
          <button
            key={s}
            type="button"
            disabled={update.isPending}
            onClick={() => submit(delivery.driverId ?? null, s)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              delivery.deliveryStatus === s
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {DELIVERY_STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order, drivers }: { order: Order; drivers: Driver[] }) {
  const updateStatus = useUpdateOrderStatus();
  const next = NEXT_STATUS[order.status];
  const isDelivery = order.fulfillmentType === "delivery";
  const total = order.subtotalCents + (order.delivery?.deliveryFeeCents ?? 0);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">
            #{order.id} — {order.pickupName}
            {isDelivery && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Delivery
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Placed {formatTime(order.createdAt)} ·{" "}
            {isDelivery
              ? `delivery ${order.scheduledFor ? formatTime(order.scheduledFor) : ""}`
              : `pickup by ${order.pickupEta ? formatTime(order.pickupEta) : "ASAP"}`}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <ul className="mt-3 space-y-0.5 text-sm">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.qty}× {item.name}
          </li>
        ))}
      </ul>
      {order.note && <p className="mt-2 text-sm italic text-muted-foreground">Note: {order.note}</p>}

      {isDelivery ? (
        <p className="mt-2 font-semibold">
          {formatCents(total)} ·{" "}
          <span className={order.paymentStatus === "paid" ? "text-green-600" : "text-destructive"}>
            {order.paymentStatus === "paid" ? "Paid" : "Payment pending"}
          </span>
        </p>
      ) : (
        <p className="mt-2 font-semibold">{formatCents(order.subtotalCents)} · pay at pickup</p>
      )}

      {isDelivery && <DeliveryControls order={order} drivers={drivers} />}

      {next && (
        <Button
          size="sm"
          className="mt-3 rounded-full"
          disabled={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate(
              { id: order.id, data: { status: next } },
              { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetAdminOrdersQueryKey() }) },
            )
          }
        >
          Mark {STATUS_LABEL[next]}
        </Button>
      )}
    </Card>
  );
}

function OrdersTab({ orders, drivers }: { orders: Order[]; drivers: Driver[] }) {
  const [showHistory, setShowHistory] = useState(false);

  const todayKey = chicagoDayKey(new Date().toISOString());
  const todays = orders.filter((o) => chicagoDayKey(o.createdAt) === todayKey);
  const todayRevenueCents = todays.reduce((sum, o) => sum + o.subtotalCents, 0);

  const active = orders.filter((o) => o.status !== "picked_up");
  const completed = orders.filter((o) => o.status === "picked_up");

  return (
    <div>
      <Card className="mb-6 flex items-center justify-around p-4 text-center">
        <div>
          <p className="text-2xl font-bold">{todays.length}</p>
          <p className="text-xs text-muted-foreground">orders today</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{formatCents(todayRevenueCents)}</p>
          <p className="text-xs text-muted-foreground">revenue today</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{active.length}</p>
          <p className="text-xs text-muted-foreground">in progress</p>
        </div>
      </Card>

      {active.length === 0 ? (
        <p className="text-muted-foreground">No active orders.</p>
      ) : (
        <div className="space-y-3">
          {active.map((order) => (
            <OrderCard key={order.id} order={order} drivers={drivers} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="mt-8">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide" : "Show"} completed orders ({completed.length})
          </Button>
          {showHistory && (
            <ul className="mt-4 space-y-2">
              {completed.map((order) => (
                <li key={order.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <span>
                    #{order.id} — {order.pickupName}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {formatDay(order.createdAt)}, {formatTime(order.createdAt)}
                    </span>
                  </span>
                  <span className="font-semibold">{formatCents(order.subtotalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu tab
// ---------------------------------------------------------------------------

type CatalogItem = { id: string; name: string; category: string; priceCents: number };

// Deduped by id — the source menu repeats a few names within a category.
const CATALOG: CatalogItem[] = (() => {
  const map = new Map<string, CatalogItem>();
  for (const section of FULL_MENU) {
    for (const cat of section.categories) {
      for (const item of cat.items) {
        const id = menuItemId(cat.category, item.name);
        if (!map.has(id)) {
          map.set(id, { id, name: item.name, category: cat.category, priceCents: Math.round(item.price * 100) });
        }
      }
    }
  }
  return [...map.values()];
})();

function invalidateMenuState() {
  queryClient.invalidateQueries({ queryKey: getGetMenuStateQueryKey() });
}

function MenuRow({ item, override }: { item: CatalogItem; override?: MenuOverride }) {
  const update = useUpdateMenuOverride();
  const soldOut = override?.soldOut ?? false;
  const effectiveCents = override?.priceCents ?? item.priceCents;
  const [priceText, setPriceText] = useState((effectiveCents / 100).toFixed(2));

  const parsedCents = Math.round(Number.parseFloat(priceText) * 100);
  const priceChanged = Number.isFinite(parsedCents) && parsedCents > 0 && parsedCents !== effectiveCents;
  const hasOverride = soldOut || override?.priceCents != null;

  function save(data: { soldOut: boolean; priceCents: number | null }) {
    update.mutate({ itemId: item.id, data }, { onSuccess: invalidateMenuState });
  }

  return (
    <li className={`flex flex-wrap items-center gap-2 rounded-lg border p-3 ${soldOut ? "bg-muted/60" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${soldOut ? "line-through opacity-60" : ""}`}>{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.category}
          {override?.priceCents != null && (
            <span className="ml-2 text-primary">repriced (menu says {formatCents(item.priceCents)})</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">$</span>
        <Input
          value={priceText}
          onChange={(e) => setPriceText(e.target.value)}
          inputMode="decimal"
          className="h-8 w-20 text-right text-sm"
          aria-label={`Price for ${item.name}`}
        />
        {priceChanged && (
          <Button
            size="sm"
            className="h-8 rounded-full"
            disabled={update.isPending}
            onClick={() =>
              save({ soldOut, priceCents: parsedCents === item.priceCents ? null : parsedCents })
            }
          >
            Save
          </Button>
        )}
      </div>

      <Button
        size="sm"
        variant={soldOut ? "default" : "outline"}
        className="h-8 rounded-full"
        disabled={update.isPending}
        onClick={() => save({ soldOut: !soldOut, priceCents: override?.priceCents ?? null })}
      >
        {soldOut ? "Sold out" : "Mark sold out"}
      </Button>

      {hasOverride && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 rounded-full text-muted-foreground"
          disabled={update.isPending}
          onClick={() => {
            setPriceText((item.priceCents / 100).toFixed(2));
            save({ soldOut: false, priceCents: null });
          }}
        >
          Reset
        </Button>
      )}
    </li>
  );
}

function MenuTab({ overrides }: { overrides: MenuOverride[] }) {
  const [search, setSearch] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);

  const byId = useMemo(() => new Map(overrides.map((o) => [o.itemId, o])), [overrides]);
  const q = search.trim().toLowerCase();
  const items = CATALOG.filter((i) => {
    if (onlyChanged && !byId.has(i.id)) return false;
    if (q && !i.name.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dishes or categories…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search the menu"
          />
        </div>
        <Button
          variant={onlyChanged ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setOnlyChanged(!onlyChanged)}
        >
          Changed today ({overrides.length})
        </Button>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{items.length} items</p>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Nothing matches.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const override = byId.get(item.id);
            // Key includes the effective price so the row's price input resets
            // to the saved value after a successful update.
            const effective = override?.priceCents ?? item.priceCents;
            return <MenuRow key={`${item.id}-${effective}`} item={item} override={override} />;
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Catering tab
// ---------------------------------------------------------------------------

const CATERING_STATUS_LABEL: Record<CateringStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed: "Closed",
};

const CATERING_STATUS_FLOW: CateringStatus[] = ["new", "contacted", "quoted", "closed"];

function CateringCard({ request }: { request: CateringRequest }) {
  const updateStatus = useUpdateCateringStatus();

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold">
            #{request.id} — {request.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.eventType} · {request.eventDate} · {request.guestCount} guests
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
          {CATERING_STATUS_LABEL[request.status]}
        </span>
      </div>

      <p className="mt-2 text-sm">
        <a href={`tel:${request.phone}`} className="text-primary hover:underline">
          {request.phone}
        </a>
        {" · "}
        <a href={`mailto:${request.email}`} className="text-primary hover:underline">
          {request.email}
        </a>
      </p>

      <ul className="mt-3 space-y-0.5 text-sm">
        {request.items.map((item) => (
          <li key={item.id}>
            {item.qty}× {item.name} ({item.size} tray) — {formatCents(item.unitPriceCents * item.qty)}
          </li>
        ))}
      </ul>

      {request.note && <p className="mt-2 text-sm italic text-muted-foreground">Note: {request.note}</p>}

      <p className="mt-2 font-semibold">
        Estimate shown: {formatCents(request.estimateCents)}
        <span className="ml-2 text-xs font-normal text-muted-foreground">confirm before quoting</span>
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {CATERING_STATUS_FLOW.filter((s) => s !== request.status).map((status) => (
          <Button
            key={status}
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate(
                { id: request.id, data: { status } },
                {
                  onSuccess: () =>
                    queryClient.invalidateQueries({ queryKey: getGetAdminCateringRequestsQueryKey() }),
                },
              )
            }
          >
            Mark {CATERING_STATUS_LABEL[status]}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function CateringTab({ requests }: { requests: CateringRequest[] }) {
  const [showClosed, setShowClosed] = useState(false);

  const open = requests.filter((r) => r.status !== "closed");
  const closed = requests.filter((r) => r.status === "closed");

  return (
    <div>
      {open.length === 0 ? (
        <p className="text-muted-foreground">No open catering requests.</p>
      ) : (
        <div className="space-y-3">
          {open.map((request) => (
            <CateringCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {closed.length > 0 && (
        <div className="mt-8">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowClosed(!showClosed)}>
            {showClosed ? "Hide" : "Show"} closed requests ({closed.length})
          </Button>
          {showClosed && (
            <div className="mt-4 space-y-3">
              {closed.map((request) => (
                <CateringCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drivers tab
// ---------------------------------------------------------------------------

function DriversTab({ drivers }: { drivers: Driver[] }) {
  const createDriver = useCreateDriver();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Enter a name and phone.");
      return;
    }
    createDriver.mutate(
      { data: { name: name.trim(), phone: phone.trim() } },
      {
        onSuccess: () => {
          setName("");
          setPhone("");
          queryClient.invalidateQueries({ queryKey: getGetAdminDriversQueryKey() });
        },
        onError: () => setError("Couldn't add that driver."),
      },
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="mb-3 font-semibold">Add a driver</p>
        <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Driver name" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" aria-label="Driver phone" />
          <Button type="submit" className="rounded-full" disabled={createDriver.isPending}>
            {createDriver.isPending ? "Adding…" : "Add"}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </Card>

      {drivers.length === 0 ? (
        <p className="text-muted-foreground">No drivers yet. Add one above before assigning deliveries.</p>
      ) : (
        <ul className="space-y-2">
          {drivers.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span className="font-medium">{d.name}</span>
              <a href={`tel:${d.phone}`} className="text-primary hover:underline">
                {d.phone}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Store tab
// ---------------------------------------------------------------------------

function StoreTab({ orderingPaused }: { orderingPaused: boolean }) {
  const updateStore = useUpdateStoreState();

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Online ordering</p>
          <p className="text-sm text-muted-foreground">
            {orderingPaused
              ? "Paused — customers see a notice and can't place orders."
              : "Open — customers can place pickup orders."}
          </p>
        </div>
        <Button
          variant={orderingPaused ? "default" : "destructive"}
          className="rounded-full"
          disabled={updateStore.isPending}
          onClick={() =>
            updateStore.mutate(
              { data: { orderingPaused: !orderingPaused } },
              { onSuccess: invalidateMenuState },
            )
          }
        >
          {orderingPaused ? "Resume ordering" : "Pause ordering"}
        </Button>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const TABS = ["Orders", "Menu", "Catering", "Drivers", "Store"] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Orders");
  const adminLogin = useAdminLogin();
  const adminLogout = useAdminLogout();

  const orders = useGetAdminOrders({
    query: { queryKey: getGetAdminOrdersQueryKey(), refetchInterval: 15000, retry: false },
  });
  const menuState = useGetMenuState({
    query: { queryKey: getGetMenuStateQueryKey(), refetchInterval: 30000, retry: false },
  });
  const cateringRequests = useGetAdminCateringRequests({
    query: { queryKey: getGetAdminCateringRequestsQueryKey(), refetchInterval: 60000, retry: false },
  });
  const drivers = useGetAdminDrivers({
    query: { queryKey: getGetAdminDriversQueryKey(), refetchInterval: 60000, retry: false },
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    adminLogin.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          setPassword("");
          orders.refetch();
        },
        onError: () => setLoginError("Wrong password."),
      },
    );
  }

  // The board query 401s when not logged in as staff — that's our sign to
  // show the login form instead of a broken order list.
  if (orders.isError) {
    return (
      <div className="container mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-6 text-2xl font-bold">Staff Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="password"
            autoFocus
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Staff password"
          />
          {loginError && <p className="text-sm text-destructive">{loginError}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={adminLogin.isPending}>
            {adminLogin.isPending ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => adminLogout.mutate(undefined, { onSuccess: () => orders.refetch() })}
        >
          Log out
        </Button>
      </div>

      {menuState.data?.orderingPaused && tab !== "Store" && (
        <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
          Online ordering is paused — resume it from the Store tab.
        </p>
      )}

      <div className="mb-6 flex gap-1 rounded-full border p-1 self-start w-fit" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Orders" &&
        (orders.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <OrdersTab orders={orders.data ?? []} drivers={drivers.data ?? []} />
        ))}
      {tab === "Menu" &&
        (menuState.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <MenuTab overrides={menuState.data?.overrides ?? []} />
        ))}
      {tab === "Catering" &&
        (cateringRequests.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <CateringTab requests={cateringRequests.data ?? []} />
        ))}
      {tab === "Drivers" &&
        (drivers.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <DriversTab drivers={drivers.data ?? []} />
        ))}
      {tab === "Store" && <StoreTab orderingPaused={menuState.data?.orderingPaused ?? false} />}
    </div>
  );
}
