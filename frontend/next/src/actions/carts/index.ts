"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { handleAxiosError, ActionResponse } from "@/lib/api-client-utils";
import {
  cartsValidator,
  CreateCartsInput,
  QueryCartsInput,
  UpdateCartsInput,
} from "./validators";
import type { Carts } from "@/types/carts";

const resource = "carts";
const revalidatePaths = ["/carts", "/dashboard"];

export async function createCarts(
  input: CreateCartsInput
): Promise<ActionResponse<Carts>> {
  try {
    const validated = cartsValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as Carts,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }

    return handleAxiosError<Carts>(error);
  }
}

export async function findCarts(query?: Partial<QueryCartsInput>): Promise<
  ActionResponse<{
    data: Carts[];
    count: number;
    cursor: string | null;
    hasNextPage: boolean;
  }>
> {
  try {
    const validated = cartsValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: {
        data: response.data.data as Carts[],
        count: response.data.count,
        cursor: response.data.nextCursor,
        hasNextPage: response.data.hasNextPage,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }

    return handleAxiosError<{
      data: Carts[];
      count: number;
      cursor: string | null;
      hasNextPage: boolean;
    }>(error);
  }
}

export async function getCarts(id: string): Promise<ActionResponse<Carts>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const apiClient = await createApiClient(resource);

    const response = await apiClient.get(`/${id}`);

    return {
      success: true,
      data: response.data.data as Carts,
    };
  } catch (error) {
    return handleAxiosError<Carts>(error);
  }
}

export async function updateCarts(
  id: string,
  input: UpdateCartsInput
): Promise<ActionResponse<Carts>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = cartsValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as Carts,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }

    return handleAxiosError<Carts>(error);
  }
}

export async function deleteCarts(id: string): Promise<ActionResponse<void>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const apiClient = await createApiClient(resource);

    await apiClient.delete(`/${id}`);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
    };
  } catch (error) {
    return handleAxiosError<void>(error);
  }
}
