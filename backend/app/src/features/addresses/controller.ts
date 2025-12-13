import { createController } from "../../services/controller.ts";
import { addressesTimeStampColumns } from "./columns.ts";
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
  timestampColumns: new Set<string>(addressesTimeStampColumns),
});

export {
  createAddresses,
  getAddresses,
  findAddresses,
  updateAddresses,
  deleteAddresses,
};
