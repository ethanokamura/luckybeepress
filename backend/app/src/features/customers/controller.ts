import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/customers.ts";
import {
  customersSortColumns,
} from "./services/columns.ts";

import { customersValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  Customers,
} from "../../../types/customers.ts";

/**
 * Create a new Customers
 * @param {*} c - Hono Context object
 */
export const createCustomers: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const customers = await create(body);
    if (!customers) {
      return c.json(
        {
          success: false,
          error: "Customers not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: customers,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating Customers:", error);
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
 * Get a Customers by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getCustomers: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const customers = await read(id);
    if (!customers) {
      return c.json(
        {
          success: false,
          error: "Customers not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: customers,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching Customers:", error);
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
 * Handle GET /Customers with optional query filters
 * @param {*} c - Hono Context object
 */
export const findCustomers: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = customersValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<Customers>(
      "customers",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(customersSortColumns),
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
    console.error("Error fetching Customers:", error);
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
 * Update a Customers's details
 * @param {*} c - Hono Context object
 */
export const updateCustomers: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const customers = await update(id, body);
    if (!customers) {
      return c.json(
        {
          success: false,
          error: "Customers not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: customers,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating Customers:", error);
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
 * Deletes a Customers and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteCustomers: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "Customers not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("Customers deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting Customers:", error);
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
