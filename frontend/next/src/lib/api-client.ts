"use server";

import axios, { AxiosInstance } from "axios";

import { auth0 } from "./auth0";

export async function createApiClient(
  resource: string
): Promise<AxiosInstance> {
  const accessToken = await auth0.getAccessToken();
  console.log(JSON.stringify(accessToken.token));
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v0";
  console.log(`Creating API Client for ${apiUrl}/${apiVersion}/${resource}`);
  return axios.create({
    baseURL: `${apiUrl}/${apiVersion}/${resource}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.token}`,
    },
  });
}
