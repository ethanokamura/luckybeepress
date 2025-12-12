import type { Context, Handler } from "hono";
import { getPaginatedResults } from "../utils/pagination.ts";
import * as service from "./service.ts";
import { QueryParams } from "../types/queries.ts";

// Define a type for the dependencies needed to create a controller
interface ControllerDependencies {
  tableName: string;
  entityName: string;
  sortColumns: Set<string>;
}

// Factory function that returns all CRUD handlers for a given entity
export function createController<T>(deps: ControllerDependencies) {
  const { tableName, entityName, sortColumns } = deps;

  // --- POST /entity ---
  const createEntity: Handler = async (c: Context) => {
    const body = await c.req.json();
    try {
      const entity = await service.create<T>(tableName, body);
      if (!entity) {
        return c.json(
          { success: false, error: `${entityName} could not be created` },
          400
        );
      }
      return c.json({ success: true, data: entity }, 201);
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
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

  // --- GET /entity/:id ---
  const getEntity: Handler = async (c: Context) => {
    const { id } = c.req.param();
    try {
      const entity = await service.read<T>(tableName, id);
      if (!entity)
        return c.json(
          {
            success: false,
            error: `${entityName} not found`,
            code: "NOT_FOUND",
          },
          404
        );
      return c.json({ success: true, data: entity }, 200);
    } catch (error) {
      console.error(`Error fetching ${entityName}:`, error);
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

  // --- GET /entity (Paginated) ---
  const findEntities: Handler = async (c: Context) => {
    const query = c.req.query();
    const { cursor, limit, order_by, order, ...filters } = query;

    try {
      const { data, nextCursor, hasNextPage } = await getPaginatedResults<T>(
        tableName,
        "id",
        {
          cursor: cursor as string | undefined,
          limit: (parseInt(limit as string) as number | undefined) ?? 10,
          order_by: (order_by as string | undefined) ?? "created_at",
          order: (order as "asc" | "desc" | undefined) ?? "desc",
          filters: (filters as Record<string, QueryParams> | undefined) ?? {},
        },
        sortColumns
      );

      return c.json({ success: true, data, nextCursor, hasNextPage }, 200);
    } catch (error) {
      console.error(`Error fetching ${tableName}s:`, error);
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

  // --- PATCH /entity/:id ---
  const updateEntity: Handler = async (c: Context) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    try {
      const entity = await service.update<T>(tableName, id, body);
      if (!entity)
        return c.json(
          {
            success: false,
            error: `${entityName} not found`,
            code: "NOT_FOUND",
          },
          404
        );
      return c.json({ success: true, data: entity }, 200);
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);
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

  // --- DELETE /entity/:id ---
  const deleteEntity: Handler = async (c: Context) => {
    const { id } = c.req.param();
    try {
      const message = await service.erase(tableName, id);
      if (!message)
        return c.json(
          {
            success: false,
            error: `${entityName} not found`,
            code: "NOT_FOUND",
          },
          404
        );
      return c.json({ success: true, message: message }, 200);
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
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

  return {
    createEntity,
    getEntity,
    findEntities,
    updateEntity,
    deleteEntity,
  };
}
