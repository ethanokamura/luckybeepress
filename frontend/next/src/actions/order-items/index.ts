"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  orderItemsValidator,
  CreateOrderItemsInput,
  QueryOrderItemsInput,
  UpdateOrderItemsInput,
} from "./validators";
import type { OrderItems } from "@/types/order-items";

const resource = "order-items";
const revalidatePaths = ["/order-items", "/dashboard"];

export async function createOrderItems(
  input: CreateOrderItemsInput
): Promise<ActionResponse<OrderItems>> {
  try {
    const validated = orderItemsValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as OrderItems,
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

    return handleAxiosError<OrderItems>(error);
  }
}

export async function findOrderItems(
  query?: Partial<QueryOrderItemsInput>
): Promise<ActionResponse<OrderItems[]>> {
  try {
    const validated = orderItemsValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: response.data.data as OrderItems[],
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

    return handleAxiosError<OrderItems[]>(error);
  }
}

export async function getOrderItems(
  id: string
): Promise<ActionResponse<OrderItems>> {
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
      data: response.data.data as OrderItems,
    };
  } catch (error) {
    return handleAxiosError<OrderItems>(error);
  }
}

export async function updateOrderItems(
  id: string,
  input: UpdateOrderItemsInput
): Promise<ActionResponse<OrderItems>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = orderItemsValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as OrderItems,
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

    return handleAxiosError<OrderItems>(error);
  }
}

export async function deleteOrderItems(
  id: string
): Promise<ActionResponse<void>> {
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