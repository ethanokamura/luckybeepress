"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { handleAxiosError, ActionResponse } from "@/lib/api-client-utils";
import {
  customersValidator,
  CreateCustomersInput,
  QueryCustomersInput,
  UpdateCustomersInput,
} from "./validators";
import type { Customers } from "@/types/customers";

const resource = "customers";
const revalidatePaths = ["/customers", "/dashboard"];

export async function createCustomers(
  input: CreateCustomersInput
): Promise<ActionResponse<Customers>> {
  try {
    const validated = customersValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as Customers,
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

    return handleAxiosError<Customers>(error);
  }
}

export async function findCustomers(
  query?: Partial<QueryCustomersInput>
): Promise<
  ActionResponse<{
    data: Customers[];
    count: number;
    cursor: string | null;
    hasNextPage: boolean;
  }>
> {
  try {
    const validated = customersValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: {
        data: response.data.data as Customers[],
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
      data: Customers[];
      count: number;
      cursor: string | null;
      hasNextPage: boolean;
    }>(error);
  }
}

export async function getCustomers(
  id: string
): Promise<ActionResponse<Customers>> {
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
      data: response.data.data as Customers,
    };
  } catch (error) {
    return handleAxiosError<Customers>(error);
  }
}

export async function updateCustomers(
  id: string,
  input: UpdateCustomersInput
): Promise<ActionResponse<Customers>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = customersValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as Customers,
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

    return handleAxiosError<Customers>(error);
  }
}

export async function deleteCustomers(
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
