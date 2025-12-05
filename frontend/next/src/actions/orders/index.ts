"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  ordersValidator,
  CreateOrdersInput,
  QueryOrdersInput,
  UpdateOrdersInput,
} from "./validators";
import type { Orders } from "@/types/orders";

const resource = "orders";
const revalidatePaths = ["/orders", "/dashboard"];

export async function createOrders(
  input: CreateOrdersInput
): Promise<ActionResponse<Orders>> {
  try {
    const validated = ordersValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as Orders,
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

    return handleAxiosError<Orders>(error);
  }
}

export async function findOrders(
  query?: Partial<QueryOrdersInput>
): Promise<ActionResponse<Orders[]>> {
  try {
    const validated = ordersValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: response.data.data as Orders[],
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

    return handleAxiosError<Orders[]>(error);
  }
}

export async function getOrders(
  id: string
): Promise<ActionResponse<Orders>> {
  try {
    if (!id || !z.uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const apiClient = await createApiClient(resource);

    const response = await apiClient.get(`/${id}`);

    return {
      success: true,
      data: response.data.data as Orders,
    };
  } catch (error) {
    return handleAxiosError<Orders>(error);
  }
}

export async function updateOrders(
  id: string,
  input: UpdateOrdersInput
): Promise<ActionResponse<Orders>> {
  try {
    if (!id || !z.uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = ordersValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as Orders,
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

    return handleAxiosError<Orders>(error);
  }
}

export async function deleteOrders(
  id: string
): Promise<ActionResponse<void>> {
  try {
    if (!id || !z.uuid().safeParse(id).success) {
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