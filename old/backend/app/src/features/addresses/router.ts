import { Hono } from "hono";
import { addressesValidator } from "./validator.ts";
import * as controller from "./controller.ts";
import * as validator from "../../utils/validator.ts";

const addressesRouter = new Hono();

// create a new Addresses
addressesRouter.post(
  "/",
  validator.body(addressesValidator.create),
  controller.createAddresses
);

// fetch a list of Addresses
addressesRouter.get(
  "/",
  validator.query(addressesValidator.query),
  controller.findAddresses
);

// fetch a specifc Addresses
addressesRouter.get(
  "/:id",
  validator.param(addressesValidator.id),
  controller.getAddresses
);

// update a specifc Addresses
addressesRouter.patch(
  "/:id",
  validator.param(addressesValidator.id),
  validator.body(addressesValidator.update),
  controller.updateAddresses
);

// delete a specifc Addresses
addressesRouter.delete(
  "/:id",
  validator.param(addressesValidator.id),
  controller.deleteAddresses
);

export { addressesRouter };
