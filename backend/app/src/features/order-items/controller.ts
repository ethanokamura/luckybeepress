import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/order_items.ts";
import {
  orderItemsSortColumns,
} from "./services/columns.ts";

import { orderItemsValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  OrderItems,
} from "../../../types/order_items.ts";

/**
 * Create a new OrderItems
 * @param {*} c - Hono Context object
 */
export const createOrderItems: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const orderItems = await create(body);
    if (!orderItems) {
      return c.json(
        {
          success: false,
          error: "OrderItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: orderItems,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating OrderItems:", error);
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
 * Get a OrderItems by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getOrderItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const orderItems = await read(id);
    if (!orderItems) {
      return c.json(
        {
          success: false,
          error: "OrderItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: orderItems,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching OrderItems:", error);
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
 * Handle GET /OrderItems with optional query filters
 * @param {*} c - Hono Context object
 */
export const findOrderItems: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = orderItemsValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<OrderItems>(
      "order_items",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(orderItemsSortColumns),
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
    console.error("Error fetching OrderItems:", error);
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
 * Update a OrderItems's details
 * @param {*} c - Hono Context object
 */
export const updateOrderItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const orderItems = await update(id, body);
    if (!orderItems) {
      return c.json(
        {
          success: false,
          error: "OrderItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: orderItems,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating OrderItems:", error);
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
 * Deletes a OrderItems and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteOrderItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "OrderItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("OrderItems deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting OrderItems:", error);
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
