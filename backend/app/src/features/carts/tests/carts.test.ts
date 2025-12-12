import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { cartsRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "Carts API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/carts", cartsRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM carts WHERE id = $1", [id]);
      }
    });

    describe("POST /carts - Create", () => {
      it("should create a new carts with all fields", async () => {
        const newCarts = {
          customer_id: "test value",
          status: "test value",
        };

        const response = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCarts),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.customer_id, newCarts.customer_id);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a carts with only required fields", async () => {
        const newCarts = {
          customer_id: "test value",
          status: "test value",
        };

        const response = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCarts),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.customer_id, newCarts.customer_id);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidCarts = {
          // Missing required fields
        };

        const response = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidCarts),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /carts/:id - Read Single", () => {
      it("should get a carts by ID", async () => {
        const createResponse = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test customer_id",
          }),
        });

        const createData = await createResponse.json();
        const cartsId = createData.data.id;
        testIds.push(cartsId);

        const response = await app.request(`/carts/${ cartsId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, cartsId);
      });

      it("should return 404 for non-existent carts", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/carts/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Carts not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/carts/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /carts - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            customer_id: "test customer_id 1",
          },
          {
            customer_id: "test customer_id 2",
          },
          {
            customer_id: "test customer_id 3",
          },
          {
            customer_id: "test customer_id 4",
          },
          {
            customer_id: "test customer_id 5",
          },
        ];

        for (const item of testData) {
          const response = await app.request("/carts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of carts", async () => {
        const response = await app.request("/carts?limit=10", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertEquals(Array.isArray(data.data), true);
        assertEquals(data.data.length >= 5, true);
        assertExists(data.hasNextPage);
      });

      it("should respect limit parameter", async () => {
        const response = await app.request("/carts?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/carts?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /carts/:id - Update", () => {
      it("should update carts fields", async () => {
        const createResponse = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "original customer_id",
          }),
        });

        const createData = await createResponse.json();
        const cartsId = createData.data.id;
        testIds.push(cartsId);

        const updateResponse = await app.request(`/carts/${ cartsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "updated customer_id",
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, cartsId);
        assertEquals(updateData.data.customer_id, "updated customer_id");
      });

      it("should return 404 for non-existent carts", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/carts/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "updated",
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Carts not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test",
          }),
        });

        const createData = await createResponse.json();
        const cartsId = createData.data.id;
        testIds.push(cartsId);

        const response = await app.request(`/carts/${ cartsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /carts/:id - Delete", () => {
      it("should delete a carts", async () => {
        const createResponse = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "to delete",
          }),
        });

        const createData = await createResponse.json();
        const cartsId = createData.data.id;

        const deleteResponse = await app.request(`/carts/${ cartsId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `carts deleted successfully with id: ${ cartsId }`
        );

        const getResponse = await app.request(`/carts/${ cartsId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent carts", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/carts/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Carts not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/carts/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test",
          }),
        });

        const createData = await createResponse.json();
        const cartsId = createData.data.id;
        testIds.push(cartsId);

        const response = await app.request(`/carts/${ cartsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
