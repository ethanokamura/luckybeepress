import { Hono } from "hono";
import { cartsValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const cartsRouter = new Hono();

// create a new Carts
cartsRouter.post(
  "/",
  validator.body(cartsValidator.create),
  controller.createCarts
);

// fetch a list of Carts
cartsRouter.get(
  "/",
  validator.query(cartsValidator.query),
  controller.findCarts
);

// fetch a specifc Carts
cartsRouter.get(
  "/:id",
  validator.param(cartsValidator.id),
  controller.getCarts
);

// update a specifc Carts
cartsRouter.patch(
  "/:id",
  validator.param(cartsValidator.id),
  validator.body(cartsValidator.update),
  controller.updateCarts
);

// delete a specifc Carts
cartsRouter.delete(
  "/:id",
  validator.param(cartsValidator.id),
  controller.deleteCarts
);

export { cartsRouter };
