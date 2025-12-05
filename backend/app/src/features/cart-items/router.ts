import { Hono } from "hono";
import { cartItemsValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const cartItemsRouter = new Hono();

// create a new CartItems
cartItemsRouter.post(
  "/",
  validator.body(cartItemsValidator.create),
  controller.createCartItems
);

// fetch a list of CartItems
cartItemsRouter.get(
  "/",
  validator.query(cartItemsValidator.query),
  controller.findCartItems
);

// fetch a specifc CartItems
cartItemsRouter.get(
  "/:id",
  validator.param(cartItemsValidator.id),
  controller.getCartItems
);

// update a specifc CartItems
cartItemsRouter.patch(
  "/:id",
  validator.param(cartItemsValidator.id),
  validator.body(cartItemsValidator.update),
  controller.updateCartItems
);

// delete a specifc CartItems
cartItemsRouter.delete(
  "/:id",
  validator.param(cartItemsValidator.id),
  controller.deleteCartItems
);

export { cartItemsRouter };
