import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { orderItemsRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "OrderItems API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/order_items", orderItemsRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM order_items WHERE id = $1", [id]);
      }
    });

    describe("POST /order_items - Create", () => {
      it("should create a new orderItems with all fields", async () => {
        const newOrderItems = {
          order_id: "test value",
          product_id: "test value",
          sku: "test value",
          product_name: "test value",
          quantity: 42,
          unit_wholesale_price: 42,
          unit_retail_price: 42,
          subtotal: 42,
          status: "test value",
        };

        const response = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrderItems),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.order_id, newOrderItems.order_id);
        assertEquals(data.data.product_id, newOrderItems.product_id);
        assertEquals(data.data.sku, newOrderItems.sku);
        assertEquals(data.data.product_name, newOrderItems.product_name);
        assertEquals(data.data.quantity, newOrderItems.quantity);
        assertEquals(data.data.unit_wholesale_price, newOrderItems.unit_wholesale_price);
        assertEquals(data.data.subtotal, newOrderItems.subtotal);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a orderItems with only required fields", async () => {
        const newOrderItems = {
          order_id: "test value",
          product_id: "test value",
          sku: "test value",
          product_name: "test value",
          quantity: 42,
          unit_wholesale_price: 42,
          unit_retail_price: 42,
          subtotal: 42,
          status: "test value",
        };

        const response = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrderItems),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.order_id, newOrderItems.order_id);
        assertEquals(data.data.product_id, newOrderItems.product_id);
        assertEquals(data.data.sku, newOrderItems.sku);
        assertEquals(data.data.product_name, newOrderItems.product_name);
        assertEquals(data.data.quantity, newOrderItems.quantity);
        assertEquals(data.data.unit_wholesale_price, newOrderItems.unit_wholesale_price);
        assertEquals(data.data.subtotal, newOrderItems.subtotal);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidOrderItems = {
          // Missing required fields
        };

        const response = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidOrderItems),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /order_items/:id - Read Single", () => {
      it("should get a orderItems by ID", async () => {
        const createResponse = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "test order_id",
            product_id: "test product_id",
            sku: "test sku",
            product_name: "test product_name",
            quantity: 42,
            unit_wholesale_price: 42,
            subtotal: 42,
          }),
        });

        const createData = await createResponse.json();
        const orderItemsId = createData.data.id;
        testIds.push(orderItemsId);

        const response = await app.request(`/order_items/${ orderItemsId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, orderItemsId);
      });

      it("should return 404 for non-existent orderItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/order_items/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "OrderItems not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/order_items/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /order_items - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            order_id: "test order_id 1",
            product_id: "test product_id 1",
            sku: "test sku 1",
            product_name: "test product_name 1",
            quantity: 1,
            unit_wholesale_price: 1,
            subtotal: 1,
          },
          {
            order_id: "test order_id 2",
            product_id: "test product_id 2",
            sku: "test sku 2",
            product_name: "test product_name 2",
            quantity: 2,
            unit_wholesale_price: 2,
            subtotal: 2,
          },
          {
            order_id: "test order_id 3",
            product_id: "test product_id 3",
            sku: "test sku 3",
            product_name: "test product_name 3",
            quantity: 3,
            unit_wholesale_price: 3,
            subtotal: 3,
          },
          {
            order_id: "test order_id 4",
            product_id: "test product_id 4",
            sku: "test sku 4",
            product_name: "test product_name 4",
            quantity: 4,
            unit_wholesale_price: 4,
            subtotal: 4,
          },
          {
            order_id: "test order_id 5",
            product_id: "test product_id 5",
            sku: "test sku 5",
            product_name: "test product_name 5",
            quantity: 5,
            unit_wholesale_price: 5,
            subtotal: 5,
          },
        ];

        for (const item of testData) {
          const response = await app.request("/order_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of order_items", async () => {
        const response = await app.request("/order_items?limit=10", {
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
        const response = await app.request("/order_items?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/order_items?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /order_items/:id - Update", () => {
      it("should update orderItems fields", async () => {
        const createResponse = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "original order_id",
            product_id: "original product_id",
            sku: "original sku",
            product_name: "original product_name",
            quantity: 10,
            unit_wholesale_price: 10,
            subtotal: 10,
          }),
        });

        const createData = await createResponse.json();
        const orderItemsId = createData.data.id;
        testIds.push(orderItemsId);

        const updateResponse = await app.request(`/order_items/${ orderItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "updated order_id",
            product_id: "updated product_id",
            sku: "updated sku",
            product_name: "updated product_name",
            quantity: 99,
            unit_wholesale_price: 99,
            subtotal: 99,
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, orderItemsId);
        assertEquals(updateData.data.order_id, "updated order_id");
        assertEquals(updateData.data.product_id, "updated product_id");
        assertEquals(updateData.data.sku, "updated sku");
        assertEquals(updateData.data.product_name, "updated product_name");
        assertEquals(updateData.data.quantity, 99);
        assertEquals(updateData.data.unit_wholesale_price, 99);
        assertEquals(updateData.data.subtotal, 99);
      });

      it("should return 404 for non-existent orderItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/order_items/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "updated",
            product_id: "updated",
            sku: "updated",
            product_name: "updated",
            quantity: 1,
            unit_wholesale_price: 1,
            subtotal: 1,
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "OrderItems not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "test",
            product_id: "test",
            sku: "test",
            product_name: "test",
            quantity: 1,
            unit_wholesale_price: 1,
            subtotal: 1,
          }),
        });

        const createData = await createResponse.json();
        const orderItemsId = createData.data.id;
        testIds.push(orderItemsId);

        const response = await app.request(`/order_items/${ orderItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /order_items/:id - Delete", () => {
      it("should delete a orderItems", async () => {
        const createResponse = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "to delete",
            product_id: "to delete",
            sku: "to delete",
            product_name: "to delete",
            quantity: 1,
            unit_wholesale_price: 1,
            subtotal: 1,
          }),
        });

        const createData = await createResponse.json();
        const orderItemsId = createData.data.id;

        const deleteResponse = await app.request(`/order_items/${ orderItemsId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `order_items deleted successfully with id: ${ orderItemsId }`
        );

        const getResponse = await app.request(`/order_items/${ orderItemsId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent orderItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/order_items/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "OrderItems not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/order_items/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: "test",
            product_id: "test",
            sku: "test",
            product_name: "test",
            quantity: 1,
            unit_wholesale_price: 1,
            subtotal: 1,
          }),
        });

        const createData = await createResponse.json();
        const orderItemsId = createData.data.id;
        testIds.push(orderItemsId);

        const response = await app.request(`/order_items/${ orderItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
