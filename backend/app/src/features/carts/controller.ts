import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/carts.ts";
import {
  cartsSortColumns,
} from "./services/columns.ts";

import { cartsValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  Carts,
} from "../../../types/carts.ts";

/**
 * Create a new Carts
 * @param {*} c - Hono Context object
 */
export const createCarts: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const carts = await create(body);
    if (!carts) {
      return c.json(
        {
          success: false,
          error: "Carts not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: carts,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating Carts:", error);
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
 * Get a Carts by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getCarts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const carts = await read(id);
    if (!carts) {
      return c.json(
        {
          success: false,
          error: "Carts not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: carts,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching Carts:", error);
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
 * Handle GET /Carts with optional query filters
 * @param {*} c - Hono Context object
 */
export const findCarts: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = cartsValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<Carts>(
      "carts",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(cartsSortColumns),
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
    console.error("Error fetching Carts:", error);
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
 * Update a Carts's details
 * @param {*} c - Hono Context object
 */
export const updateCarts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const carts = await update(id, body);
    if (!carts) {
      return c.json(
        {
          success: false,
          error: "Carts not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: carts,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating Carts:", error);
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
 * Deletes a Carts and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteCarts: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "Carts not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("Carts deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting Carts:", error);
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
