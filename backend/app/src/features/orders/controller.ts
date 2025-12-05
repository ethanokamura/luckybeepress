import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/orders.ts";
import {
  ordersSortColumns,
} from "./services/columns.ts";

import { ordersValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  Orders,
} from "../../../types/orders.ts";

/**
 * Create a new Orders
 * @param {*} c - Hono Context object
 */
export const createOrders: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const orders = await create(body);
    if (!orders) {
      return c.json(
        {
          success: false,
          error: "Orders not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: orders,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating Orders:", error);
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
 * Get a Orders by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getOrders: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const orders = await read(id);
    if (!orders) {
      return c.json(
        {
          success: false,
          error: "Orders not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: orders,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching Orders:", error);
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
 * Handle GET /Orders with optional query filters
 * @param {*} c - Hono Context object
 */
export const findOrders: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = ordersValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<Orders>(
      "orders",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(ordersSortColumns),
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
    console.error("Error fetching Orders:", error);
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
 * Update a Orders's details
 * @param {*} c - Hono Context object
 */
export const updateOrders: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const orders = await update(id, body);
    if (!orders) {
      return c.json(
        {
          success: false,
          error: "Orders not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: orders,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating Orders:", error);
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
 * Deletes a Orders and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteOrders: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "Orders not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("Orders deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting Orders:", error);
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
