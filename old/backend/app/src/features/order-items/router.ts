import { Hono } from "hono";
import { orderItemsValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const orderItemsRouter = new Hono();

// create a new OrderItems
orderItemsRouter.post(
  "/",
  validator.body(orderItemsValidator.create),
  controller.createOrderItems
);

// fetch a list of OrderItems
orderItemsRouter.get(
  "/",
  validator.query(orderItemsValidator.query),
  controller.findOrderItems
);

// fetch a specifc OrderItems
orderItemsRouter.get(
  "/:id",
  validator.param(orderItemsValidator.id),
  controller.getOrderItems
);

// update a specifc OrderItems
orderItemsRouter.patch(
  "/:id",
  validator.param(orderItemsValidator.id),
  validator.body(orderItemsValidator.update),
  controller.updateOrderItems
);

// delete a specifc OrderItems
orderItemsRouter.delete(
  "/:id",
  validator.param(orderItemsValidator.id),
  controller.deleteOrderItems
);

export { orderItemsRouter };
