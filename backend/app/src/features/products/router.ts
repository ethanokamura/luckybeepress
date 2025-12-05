import { Hono } from "hono";
import { productsValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const productsRouter = new Hono();

// create a new Products
productsRouter.post(
  "/",
  validator.body(productsValidator.create),
  controller.createProducts
);

// fetch a list of Products
productsRouter.get(
  "/",
  validator.query(productsValidator.query),
  controller.findProducts
);

// fetch a specifc Products
productsRouter.get(
  "/:id",
  validator.param(productsValidator.id),
  controller.getProducts
);

// update a specifc Products
productsRouter.patch(
  "/:id",
  validator.param(productsValidator.id),
  validator.body(productsValidator.update),
  controller.updateProducts
);

// delete a specifc Products
productsRouter.delete(
  "/:id",
  validator.param(productsValidator.id),
  controller.deleteProducts
);

export { productsRouter };
