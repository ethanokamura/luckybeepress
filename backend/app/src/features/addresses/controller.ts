import type { Context, Handler } from "hono";
import { create, read, update, erase } from "./services/addresses.ts";
import {
  addressesSortColumns,
} from "./services/columns.ts";

import { addressesValidator } from "./validator.ts";
import { getPaginatedResults } from "../../utils/pagination.ts";
import {
  Addresses,
} from "../../../types/addresses.ts";

/**
 * Create a new Addresses
 * @param {*} c - Hono Context object
 */
export const createAddresses: Handler = async (c: Context) => {
  const body = await c.req.json();
  try {
    const addresses = await create(body);
    if (!addresses) {
      return c.json(
        {
          success: false,
          error: "Addresses not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: addresses,
      statusCode: 201,
    }, 201);
  } catch (error) {
    console.error("Error creating Addresses:", error);
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
 * Get a Addresses by its ID
 * @param {*} c - Hono Context object
 * @returns {Promise<void>}
 */
export const getAddresses: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const addresses = await read(id);
    if (!addresses) {
      return c.json(
        {
          success: false,
          error: "Addresses not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({ 
      success: true,
      data: addresses,
      statusCode: 200,
    }, 200);
  } catch (error) {
    console.error("Error fetching Addresses:", error);
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
 * Handle GET /Addresses with optional query filters
 * @param {*} c - Hono Context object
 */
export const findAddresses: Handler = async (c: Context) => {
  const rawQuery = c.req.query();
  const queryData = addressesValidator.query.parse(rawQuery);
  const { cursor, limit, order_by, order, ...filters } = queryData;

  try {
    const { data, nextCursor, hasNextPage } = await getPaginatedResults<Addresses>(
      "addresses",
      "id",
      {
        cursor: cursor,
        limit: limit,
        order_by: order_by,
        order: order,
        filters: filters,
      },
      new Set<string>(addressesSortColumns),
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
    console.error("Error fetching Addresses:", error);
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
 * Update a Addresses's details
 * @param {*} c - Hono Context object
 */
export const updateAddresses: Handler = async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  try {
    const addresses = await update(id, body);
    if (!addresses) {
      return c.json(
        {
          success: false,
          error: "Addresses not found",
          code: "NOT_FOUND",
        },
        404
      );
    }
    return c.json({
      success: true,
      data: addresses,
      statusCode: 200,
    }, 201);
  } catch (error) {
    console.error("Error updating Addresses:", error);
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
 * Deletes a Addresses and removes it from the database
 * @param {*} c - Hono Context object
 */
export const deleteAddresses: Handler = async (c: Context) => {
  const { id } = c.req.param();
  try {
    const message = await erase(id);
    if (!message) {
      return c.json(
        {
          success: false,
          error: "Addresses not found",
          code: "NOT_FOUND",
        },
        404
      );
    }

    console.log("Addresses deleted successfully");
    return c.json(
      {
        success: true,
        message: message,
        statusCode: 200,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting Addresses:", error);
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
