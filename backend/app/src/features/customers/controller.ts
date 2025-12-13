import { createController } from "../../services/controller.ts";
import { customersTimeStampColumns } from "./columns.ts";
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
  timestampColumns: new Set<string>(customersTimeStampColumns),
});

export {
  createCustomers,
  getCustomers,
  findCustomers,
  updateCustomers,
  deleteCustomers,
};
