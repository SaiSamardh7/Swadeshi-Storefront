import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import menuRouter from "./menu";
import cateringRouter from "./catering";
import deliveryRouter from "./delivery";
import ordersRouter from "./orders";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(cateringRouter);
router.use(deliveryRouter);
router.use(ordersRouter);
router.use(adminRouter);

export default router;
