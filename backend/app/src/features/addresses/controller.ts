import { createController } from "../../services/controller.ts";
import { addressesSortColumns } from "./columns.ts";
import { Addresses } from "../../../types/addresses.ts";

const {
  createEntity: createAddresses,
  getEntity: getAddresses,
  findEntities: findAddresses,
  updateEntity: updateAddresses,
  deleteEntity: deleteAddresses,
} = createController<Addresses>({
  tableName: "addresses" as const,
  entityName: "Addresses" as const,
  sortColumns: new Set<string>(addressesSortColumns),
});

export { createAddresses, getAddresses, findAddresses, updateAddresses, deleteAddresses };
