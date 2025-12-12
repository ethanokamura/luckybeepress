// lib/api-client-utils.ts (NO 'use server' directive)

import axios, { AxiosError } from "axios";
import { ZodType } from "zod";

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
  error?: string;
};

interface ApiErrorResponse {
  success: false;
  errors?: Array<{ path: string; message: string }>;
  error?: string;
}

export function handleAxiosError<T>(error: unknown): ActionResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      return {
        success: false,
        errors: axiosError.response.data.errors,
        error: axiosError.response.data.error || axiosError.message,
      };
    }

    return {
      success: false,
      error: axiosError.message,
    };
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : "An unknown error occurred",
  };
}

export interface CrudValidators<TCreate, TQuery, TUpdate> {
  create: ZodType<TCreate>;
  query: ZodType<TQuery>;
  update: ZodType<TUpdate>;
}

export interface CrudOptions {
  resource: string;
  revalidatePaths?: string[];
}
