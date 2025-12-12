import { createController } from "../../services/controller.ts";
import { orderItemsSortColumns } from "./columns.ts";
import { OrderItems } from "../../../types/order_items.ts";

const {
  createEntity: createOrderItems,
  getEntity: getOrderItems,
  findEntities: findOrderItems,
  updateEntity: updateOrderItems,
  deleteEntity: deleteOrderItems,
} = createController<OrderItems>({
  tableName: "order_items" as const,
  entityName: "OrderItems" as const,
  sortColumns: new Set<string>(orderItemsSortColumns),
});

export { createOrderItems, getOrderItems, findOrderItems, updateOrderItems, deleteOrderItems };
