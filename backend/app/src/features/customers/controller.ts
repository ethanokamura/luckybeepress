import { createController } from "../../services/controller.ts";
import { customersSortColumns } from "./columns.ts";
import { Customers } from "../../../types/customers.ts";

const {
  createEntity: createCustomers,
  getEntity: getCustomers,
  findEntities: findCustomers,
  updateEntity: updateCustomers,
  deleteEntity: deleteCustomers,
} = createController<Customers>({
  tableName: "customers" as const,
  entityName: "Customers" as const,
  sortColumns: new Set<string>(customersSortColumns),
});

export { createCustomers, getCustomers, findCustomers, updateCustomers, deleteCustomers };
