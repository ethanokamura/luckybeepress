import { createController } from "../../services/controller.ts";
import { ordersTimeStampColumns } from "./columns.ts";
import { Orders } from "../../../types/orders.ts";

const {
  createEntity: createOrders,
  getEntity: getOrders,
  findEntities: findOrders,
  updateEntity: updateOrders,
  deleteEntity: deleteOrders,
} = createController<Orders>({
  tableName: "orders" as const,
  entityName: "Orders" as const,
  timestampColumns: new Set<string>(ordersTimeStampColumns),
});
export { createOrders, getOrders, findOrders, updateOrders, deleteOrders };
