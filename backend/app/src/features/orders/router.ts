import { Hono } from "hono";
import { ordersValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const ordersRouter = new Hono();

// create a new Orders
ordersRouter.post(
  "/",
  validator.body(ordersValidator.create),
  controller.createOrders
);

// fetch a list of Orders
ordersRouter.get(
  "/",
  validator.query(ordersValidator.query),
  controller.findOrders
);

// fetch a specifc Orders
ordersRouter.get(
  "/:id",
  validator.param(ordersValidator.id),
  controller.getOrders
);

// update a specifc Orders
ordersRouter.patch(
  "/:id",
  validator.param(ordersValidator.id),
  validator.body(ordersValidator.update),
  controller.updateOrders
);

// delete a specifc Orders
ordersRouter.delete(
  "/:id",
  validator.param(ordersValidator.id),
  controller.deleteOrders
);

export { ordersRouter };
