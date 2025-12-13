import { createController } from "../../services/controller.ts";
import { productsTimeStampColumns } from "./columns.ts";
import { Products } from "../../../types/products.ts";
import { Context, Handler } from "hono";
import { query } from "../../db/pool.ts";

const {
  createEntity: createProducts,
  getEntity: getProducts,
  findEntities: findProducts,
  updateEntity: updateProducts,
  deleteEntity: deleteProducts,
} = createController<Products>({
  tableName: "products" as const,
  entityName: "Products" as const,
  timestampColumns: new Set<string>(productsTimeStampColumns),
});

/**
 * Handle GET /Products with optional query filters
 * @param {*} c - Hono Context object
 */
const findCategories: Handler = async (c: Context) => {
  try {
    const { rows } = await query<string[]>(
      "SELECT DISTINCT category FROM products ORDER BY category ASC"
    );

    return c.json(
      {
        success: true,
        data: rows,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
};

export {
  createProducts,
  getProducts,
  findProducts,
  updateProducts,
  deleteProducts,
  findCategories,
};
