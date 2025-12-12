"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  productsValidator,
  CreateProductsInput,
  QueryProductsInput,
  UpdateProductsInput,
} from "./validators";
import type { Products } from "@/types/products";

const resource = "products";
const revalidatePaths = ["/products", "/dashboard"];

export async function createProducts(
  input: CreateProductsInput
): Promise<ActionResponse<Products>> {
  try {
    const validated = productsValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as Products,
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

    return handleAxiosError<Products>(error);
  }
}

export async function findProducts(
  query?: Partial<QueryProductsInput>
): Promise<ActionResponse<Products[]>> {
  try {
    const validated = productsValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: response.data.data as Products[],
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

    return handleAxiosError<Products[]>(error);
  }
}

export async function getProducts(
  id: string
): Promise<ActionResponse<Products>> {
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
      data: response.data.data as Products,
    };
  } catch (error) {
    return handleAxiosError<Products>(error);
  }
}

export async function updateProducts(
  id: string,
  input: UpdateProductsInput
): Promise<ActionResponse<Products>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = productsValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as Products,
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

    return handleAxiosError<Products>(error);
  }
}

export async function deleteProducts(
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

export async function findCategories(): Promise<ActionResponse<string[]>> {
  try {
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("/categories");

    // The API returns { category: string }[] so we need to extract the category strings
    const categories = response.data.data.map(
      (item: { category: string }) => item.category
    );

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return handleAxiosError<string[]>(error);
  }
}