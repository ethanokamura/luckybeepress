import { createController } from "../../services/controller.ts";
import { cartsTimeStampColumns } from "./columns.ts";
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
  timestampColumns: new Set<string>(cartsTimeStampColumns),
});

export { createCarts, getCarts, findCarts, updateCarts, deleteCarts };
