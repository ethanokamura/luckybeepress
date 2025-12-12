import { createController } from "../../services/controller.ts";
import { cartsSortColumns } from "./columns.ts";
import { Carts } from "../../../types/carts.ts";

const {
  createEntity: createCarts,
  getEntity: getCarts,
  findEntities: findCarts,
  updateEntity: updateCarts,
  deleteEntity: deleteCarts,
} = createController<Carts>({
  tableName: "carts" as const,
  entityName: "Carts" as const,
  sortColumns: new Set<string>(cartsSortColumns),
});

export { createCarts, getCarts, findCarts, updateCarts, deleteCarts };
