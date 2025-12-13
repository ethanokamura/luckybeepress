import { createController } from "../../services/controller.ts";
import { cartItemsTimeStampColumns } from "./columns.ts";
import { CartItems } from "../../../types/cart_items.ts";

const {
  createEntity: createCartItems,
  getEntity: getCartItems,
  findEntities: findCartItems,
  updateEntity: updateCartItems,
  deleteEntity: deleteCartItems,
} = createController<CartItems>({
  tableName: "cart_items" as const,
  entityName: "CartItems" as const,
  timestampColumns: new Set<string>(cartItemsTimeStampColumns),
});

export {
  createCartItems,
  getCartItems,
  findCartItems,
  updateCartItems,
  deleteCartItems,
};
