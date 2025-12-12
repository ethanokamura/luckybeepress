"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  addressesValidator,
  CreateAddressesInput,
  QueryAddressesInput,
  UpdateAddressesInput,
} from "./validators";
import type { Addresses } from "@/types/addresses";

const resource = "addresses";
const revalidatePaths = ["/addresses", "/dashboard"];

export async function createAddresses(
  input: CreateAddressesInput
): Promise<ActionResponse<Addresses>> {
  try {
    const validated = addressesValidator.create.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.post("", validated);

    revalidatePaths.forEach((path) => revalidatePath(path));

    return {
      success: true,
      data: response.data.data as Addresses,
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

    return handleAxiosError<Addresses>(error);
  }
}

export async function findAddresses(
  query?: Partial<QueryAddressesInput>
): Promise<ActionResponse<Addresses[]>> {
  try {
    const validated = addressesValidator.query.parse(query || {});
    const apiClient = await createApiClient(resource);

    const response = await apiClient.get("", {
      params: validated,
    });

    return {
      success: true,
      data: response.data.data as Addresses[],
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

    return handleAxiosError<Addresses[]>(error);
  }
}

export async function getAddresses(
  id: string
): Promise<ActionResponse<Addresses>> {
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
      data: response.data.data as Addresses,
    };
  } catch (error) {
    return handleAxiosError<Addresses>(error);
  }
}

export async function updateAddresses(
  id: string,
  input: UpdateAddressesInput
): Promise<ActionResponse<Addresses>> {
  try {
    if (!id || !z.string().uuid().safeParse(id).success) {
      return {
        success: false,
        error: `Invalid ${resource} ID`,
      };
    }

    const validated = addressesValidator.update.parse(input);
    const apiClient = await createApiClient(resource);

    const response = await apiClient.patch(`/${id}`, validated);

    revalidatePaths.forEach((path) => revalidatePath(path));
    revalidatePath(`/${resource}/${id}`);

    return {
      success: true,
      data: response.data.data as Addresses,
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

    return handleAxiosError<Addresses>(error);
  }
}

export async function deleteAddresses(
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