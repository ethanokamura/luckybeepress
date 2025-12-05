import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/products.ts";
import {
  productsSortColumns,
} from "./services/columns.ts";

import { productsValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  Products,
} from "../../../types/products.ts";

/**
 * Create a new Products
 * @param {*} c - Hono Context object
 */
export const createProducts: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const products = await create(body);
    if (!products) {
      return c.json(
        {
          success: false,
          error: "Products not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: products,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating Products:", error);
    return c.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
};

/**
 * Get a Products by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getProducts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const products = await read(id);
    if (!products) {
      return c.json(
        {
          success: false,
          error: "Products not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: products,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching Products:", error);
    return c.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
};

/**
 * Handle GET /Products with optional query filters
 * @param {*} c - Hono Context object
 */
export const findProducts: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = productsValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<Products>(
      "products",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(productsSortColumns),
    );

    return c.json(
      {
        success: true,
        data: data,
        nextCursor: nextCursor,
        hasNextPage: hasNextPage,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error fetching Products:", error);
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

/**
 * Update a Products's details
 * @param {*} c - Hono Context object
 */
export const updateProducts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const products = await update(id, body);
    if (!products) {
      return c.json(
        {
          success: false,
          error: "Products not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: products,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating Products:", error);
    return c.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
};

/**
 * Deletes a Products and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteProducts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "Products not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("Products deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting Products:", error);
    return c.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
};
