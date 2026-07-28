import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminOrdersResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
  UpdateMenuOverrideParams,
  UpdateMenuOverrideBody,
  UpdateMenuOverrideResponse,
  UpdateStoreStateBody,
  UpdateStoreStateResponse,
  GetAdminCateringRequestsResponse,
  UpdateCateringStatusParams,
  UpdateCateringStatusBody,
  UpdateCateringStatusResponse,
  GetAdminDriversResponse,
  CreateDriverBody,
  CreateDriverResponse,
  UpdateOrderDeliveryParams,
  UpdateOrderDeliveryBody,
  UpdateOrderDeliveryResponse,
} from "@workspace/api-zod";
import {
  db,
  ordersTable,
  orderItemsTable,
  cateringRequestsTable,
  cateringRequestItemsTable,
  driversTable,
  orderDeliveriesTable,
} from "@workspace/db";
import { getMenuItem } from "@workspace/menu";
import { setMenuOverride, setOrderingPaused } from "../lib/store-state";
import { deliveriesByOrderId } from "../lib/order-delivery";
import {
  adminConfigured,
  checkPassword,
  createAdminSession,
  isAdmin,
  destroyAdminSession,
} from "../lib/admin-session";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success || !adminConfigured() || !checkPassword(parsed.data.password)) {
    res.status(401).json({ error: "Wrong password." });
    return;
  }
  createAdminSession(res);
  res.json(AdminLoginResponse.parse({ ok: true }));
});

router.post("/admin/logout", (req, res) => {
  destroyAdminSession(req, res);
  res.json(AdminLoginResponse.parse({ ok: true }));
});

router.get("/admin/orders", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  const deliveries = await deliveriesByOrderId(orders.map((o) => o.id));
  const withItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      return { ...order, items, delivery: deliveries.get(order.id) ?? null };
    }),
  );

  res.json(GetAdminOrdersResponse.parse(withItems));
});

router.post("/admin/orders/:id/status", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const params = UpdateOrderStatusParams.safeParse(req.params);
  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid order id or status." });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  const deliveries = await deliveriesByOrderId([order.id]);
  res.json(UpdateOrderStatusResponse.parse({ ...order, items, delivery: deliveries.get(order.id) ?? null }));
});

router.put("/admin/menu/overrides/:itemId", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const params = UpdateMenuOverrideParams.safeParse(req.params);
  const body = UpdateMenuOverrideBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid item or override." });
    return;
  }
  if (!getMenuItem(params.data.itemId)) {
    res.status(404).json({ error: "Unknown menu item." });
    return;
  }

  const override = await setMenuOverride(
    params.data.itemId,
    body.data.soldOut,
    body.data.priceCents,
  );
  res.json(UpdateMenuOverrideResponse.parse(override));
});

router.post("/admin/store", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const body = UpdateStoreStateBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid store state." });
    return;
  }

  const settings = await setOrderingPaused(body.data.orderingPaused);
  res.json(UpdateStoreStateResponse.parse({ orderingPaused: settings.orderingPaused }));
});

router.get("/admin/catering", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const requests = await db
    .select()
    .from(cateringRequestsTable)
    .orderBy(desc(cateringRequestsTable.createdAt));

  const withItems = await Promise.all(
    requests.map(async (request) => {
      const items = await db
        .select()
        .from(cateringRequestItemsTable)
        .where(eq(cateringRequestItemsTable.requestId, request.id));
      return { ...request, items };
    }),
  );

  res.json(GetAdminCateringRequestsResponse.parse(withItems));
});

router.post("/admin/catering/:id/status", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const params = UpdateCateringStatusParams.safeParse(req.params);
  const body = UpdateCateringStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request id or status." });
    return;
  }

  const [request] = await db
    .update(cateringRequestsTable)
    .set({ status: body.data.status })
    .where(eq(cateringRequestsTable.id, params.data.id))
    .returning();

  if (!request) {
    res.status(404).json({ error: "Catering request not found." });
    return;
  }

  const items = await db
    .select()
    .from(cateringRequestItemsTable)
    .where(eq(cateringRequestItemsTable.requestId, request.id));

  res.json(UpdateCateringStatusResponse.parse({ ...request, items }));
});

router.get("/admin/drivers", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }
  const drivers = await db.select().from(driversTable).orderBy(driversTable.name);
  res.json(GetAdminDriversResponse.parse(drivers));
});

router.post("/admin/drivers", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }
  const body = CreateDriverBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Enter a driver name and phone." });
    return;
  }
  const [driver] = await db
    .insert(driversTable)
    .values({ name: body.data.name, phone: body.data.phone })
    .returning();
  res.status(201).json(CreateDriverResponse.parse(driver));
});

router.post("/admin/orders/:id/delivery", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Staff login required." });
    return;
  }

  const params = UpdateOrderDeliveryParams.safeParse(req.params);
  const body = UpdateOrderDeliveryBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid order id or delivery update." });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id)).limit(1);
  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }
  if (order.fulfillmentType !== "delivery") {
    res.status(400).json({ error: "That order is not a delivery order." });
    return;
  }

  const [existing] = await db
    .select()
    .from(orderDeliveriesTable)
    .where(eq(orderDeliveriesTable.orderId, order.id))
    .limit(1);
  if (!existing) {
    res.status(404).json({ error: "No delivery details for this order." });
    return;
  }

  const driverId = body.data.driverId ?? null;
  if (driverId !== null) {
    const [driver] = await db.select().from(driversTable).where(eq(driversTable.id, driverId)).limit(1);
    if (!driver) {
      res.status(404).json({ error: "Driver not found." });
      return;
    }
  }

  await db
    .update(orderDeliveriesTable)
    .set({ driverId, deliveryStatus: body.data.deliveryStatus, updatedAt: new Date() })
    .where(eq(orderDeliveriesTable.orderId, order.id));

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  const delivery = (await deliveriesByOrderId([order.id])).get(order.id) ?? null;
  res.json(UpdateOrderDeliveryResponse.parse({ ...order, items, delivery }));
});

export default router;
