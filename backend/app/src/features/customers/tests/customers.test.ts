import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { customersRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "Customers API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/customers", customersRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM customers WHERE id = $1", [id]);
      }
    });

    describe("POST /customers - Create", () => {
      it("should create a new customers with all fields", async () => {
        const newCustomers = {
          business_name: "test value",
          contact_name: "test value",
          email: "test value",
          phone: "test value",
          tax_id: "test value",
          account_status: "test value",
          net_terms: 42,
          discount_percentage: 42,
          first_order_date: new Date(),
          total_orders: 42,
          lifetime_value: 42,
          notes: "test value",
        };

        const response = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCustomers),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.business_name, newCustomers.business_name);
        assertEquals(data.data.email, newCustomers.email);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a customers with only required fields", async () => {
        const newCustomers = {
          business_name: "test value",
          contact_name: "test value",
          email: "test value",
          phone: "test value",
          tax_id: "test value",
          account_status: "test value",
          net_terms: 42,
          discount_percentage: 42,
          first_order_date: new Date(),
          total_orders: 42,
          lifetime_value: 42,
          notes: "test value",
        };

        const response = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCustomers),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.business_name, newCustomers.business_name);
        assertEquals(data.data.email, newCustomers.email);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidCustomers = {
          // Missing required fields
        };

        const response = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidCustomers),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /customers/:id - Read Single", () => {
      it("should get a customers by ID", async () => {
        const createResponse = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "test business_name",
            email: "test email",
          }),
        });

        const createData = await createResponse.json();
        const customersId = createData.data.id;
        testIds.push(customersId);

        const response = await app.request(`/customers/${ customersId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, customersId);
      });

      it("should return 404 for non-existent customers", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/customers/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Customers not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/customers/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /customers - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            business_name: "test business_name 1",
            email: "test email 1",
          },
          {
            business_name: "test business_name 2",
            email: "test email 2",
          },
          {
            business_name: "test business_name 3",
            email: "test email 3",
          },
          {
            business_name: "test business_name 4",
            email: "test email 4",
          },
          {
            business_name: "test business_name 5",
            email: "test email 5",
          },
        ];

        for (const item of testData) {
          const response = await app.request("/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of customers", async () => {
        const response = await app.request("/customers?limit=10", {
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
        const response = await app.request("/customers?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/customers?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /customers/:id - Update", () => {
      it("should update customers fields", async () => {
        const createResponse = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "original business_name",
            email: "original email",
          }),
        });

        const createData = await createResponse.json();
        const customersId = createData.data.id;
        testIds.push(customersId);

        const updateResponse = await app.request(`/customers/${ customersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "updated business_name",
            email: "updated email",
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, customersId);
        assertEquals(updateData.data.business_name, "updated business_name");
        assertEquals(updateData.data.email, "updated email");
      });

      it("should return 404 for non-existent customers", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/customers/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "updated",
            email: "updated",
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Customers not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "test",
            email: "test",
          }),
        });

        const createData = await createResponse.json();
        const customersId = createData.data.id;
        testIds.push(customersId);

        const response = await app.request(`/customers/${ customersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /customers/:id - Delete", () => {
      it("should delete a customers", async () => {
        const createResponse = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "to delete",
            email: "to delete",
          }),
        });

        const createData = await createResponse.json();
        const customersId = createData.data.id;

        const deleteResponse = await app.request(`/customers/${ customersId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `customers deleted successfully with id: ${ customersId }`
        );

        const getResponse = await app.request(`/customers/${ customersId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent customers", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/customers/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Customers not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/customers/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: "test",
            email: "test",
          }),
        });

        const createData = await createResponse.json();
        const customersId = createData.data.id;
        testIds.push(customersId);

        const response = await app.request(`/customers/${ customersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
