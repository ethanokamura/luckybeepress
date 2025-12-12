import { Hono } from "hono";
import { customersValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const customersRouter = new Hono();

// create a new Customers
customersRouter.post(
  "/",
  validator.body(customersValidator.create),
  controller.createCustomers
);

// fetch a list of Customers
customersRouter.get(
  "/",
  validator.query(customersValidator.query),
  controller.findCustomers
);

// fetch a specifc Customers
customersRouter.get(
  "/:id",
  validator.param(customersValidator.id),
  controller.getCustomers
);

// update a specifc Customers
customersRouter.patch(
  "/:id",
  validator.param(customersValidator.id),
  validator.body(customersValidator.update),
  controller.updateCustomers
);

// delete a specifc Customers
customersRouter.delete(
  "/:id",
  validator.param(customersValidator.id),
  controller.deleteCustomers
);

export { customersRouter };
