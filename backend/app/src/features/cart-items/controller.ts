import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/cart_items.ts";
import {
  cartItemsSortColumns,
} from "./services/columns.ts";

import { cartItemsValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  CartItems,
} from "../../../types/cart_items.ts";

/**
 * Create a new CartItems
 * @param {*} c - Hono Context object
 */
export const createCartItems: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const cartItems = await create(body);
    if (!cartItems) {
      return c.json(
        {
          success: false,
          error: "CartItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: cartItems,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating CartItems:", error);
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
 * Get a CartItems by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getCartItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const cartItems = await read(id);
    if (!cartItems) {
      return c.json(
        {
          success: false,
          error: "CartItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: cartItems,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching CartItems:", error);
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
 * Handle GET /CartItems with optional query filters
 * @param {*} c - Hono Context object
 */
export const findCartItems: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = cartItemsValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<CartItems>(
      "cart_items",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(cartItemsSortColumns),
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
    console.error("Error fetching CartItems:", error);
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
 * Update a CartItems's details
 * @param {*} c - Hono Context object
 */
export const updateCartItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const cartItems = await update(id, body);
    if (!cartItems) {
      return c.json(
        {
          success: false,
          error: "CartItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: cartItems,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating CartItems:", error);
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
 * Deletes a CartItems and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteCartItems: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "CartItems not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("CartItems deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting CartItems:", error);
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
