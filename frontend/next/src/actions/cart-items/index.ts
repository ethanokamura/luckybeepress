"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  cartItemsValidator,
  CreateCartItemsInput,
  QueryCartItemsInput,
  UpdateCartItemsInput,
} from "./validators";
import type { CartItems } from "@/types/cart-items";

const resource = "cart-items";
const revalidatePaths = ["/cart-items", "/dashboard"];

export async function createCartItems(
  input: CreateCartItemsInput
): Promise<ActionResponse<CartItems>> {
  try {
    const validated = cartItemsValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as CartItems,
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

    return handleAxiosError<CartItems>(error);
  }
}

export async function findCartItems(
  query?: Partial<QueryCartItemsInput>
): Promise<ActionResponse<CartItems[]>> {
  try {
    const validated = cartItemsValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: response.data.data as CartItems[],
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

    return handleAxiosError<CartItems[]>(error);
  }
}

export async function getCartItems(
  id: string
): Promise<ActionResponse<CartItems>> {
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
      data: response.data.data as CartItems,
    };
  } catch (error) {
    return handleAxiosError<CartItems>(error);
  }
}

export async function updateCartItems(
  id: string,
  input: UpdateCartItemsInput
): Promise<ActionResponse<CartItems>> {
  try {
    if (!id || !z.uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = cartItemsValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as CartItems,
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

    return handleAxiosError<CartItems>(error);
  }
}

export async function deleteCartItems(
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