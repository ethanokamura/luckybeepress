import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { cartItemsRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "CartItems API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/cart_items", cartItemsRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM cart_items WHERE id = $1", [id]);
      }
    });

    describe("POST /cart_items - Create", () => {
      it("should create a new cartItems with all fields", async () => {
        const newCartItems = {
          cart_id: "test value",
          product_id: "test value",
          quantity: 42,
          unit_price: 42,
        };

        const response = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCartItems),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.cart_id, newCartItems.cart_id);
        assertEquals(data.data.product_id, newCartItems.product_id);
        assertEquals(data.data.quantity, newCartItems.quantity);
        assertEquals(data.data.unit_price, newCartItems.unit_price);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a cartItems with only required fields", async () => {
        const newCartItems = {
          cart_id: "test value",
          product_id: "test value",
          quantity: 42,
          unit_price: 42,
        };

        const response = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCartItems),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.cart_id, newCartItems.cart_id);
        assertEquals(data.data.product_id, newCartItems.product_id);
        assertEquals(data.data.quantity, newCartItems.quantity);
        assertEquals(data.data.unit_price, newCartItems.unit_price);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidCartItems = {
          // Missing required fields
        };

        const response = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidCartItems),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /cart_items/:id - Read Single", () => {
      it("should get a cartItems by ID", async () => {
        const createResponse = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "test cart_id",
            product_id: "test product_id",
            quantity: 42,
            unit_price: 42,
          }),
        });

        const createData = await createResponse.json();
        const cartItemsId = createData.data.id;
        testIds.push(cartItemsId);

        const response = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, cartItemsId);
      });

      it("should return 404 for non-existent cartItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/cart_items/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "CartItems not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/cart_items/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /cart_items - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            cart_id: "test cart_id 1",
            product_id: "test product_id 1",
            quantity: 1,
            unit_price: 1,
          },
          {
            cart_id: "test cart_id 2",
            product_id: "test product_id 2",
            quantity: 2,
            unit_price: 2,
          },
          {
            cart_id: "test cart_id 3",
            product_id: "test product_id 3",
            quantity: 3,
            unit_price: 3,
          },
          {
            cart_id: "test cart_id 4",
            product_id: "test product_id 4",
            quantity: 4,
            unit_price: 4,
          },
          {
            cart_id: "test cart_id 5",
            product_id: "test product_id 5",
            quantity: 5,
            unit_price: 5,
          },
        ];

        for (const item of testData) {
          const response = await app.request("/cart_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of cart_items", async () => {
        const response = await app.request("/cart_items?limit=10", {
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
        const response = await app.request("/cart_items?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/cart_items?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /cart_items/:id - Update", () => {
      it("should update cartItems fields", async () => {
        const createResponse = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "original cart_id",
            product_id: "original product_id",
            quantity: 10,
            unit_price: 10,
          }),
        });

        const createData = await createResponse.json();
        const cartItemsId = createData.data.id;
        testIds.push(cartItemsId);

        const updateResponse = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "updated cart_id",
            product_id: "updated product_id",
            quantity: 99,
            unit_price: 99,
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, cartItemsId);
        assertEquals(updateData.data.cart_id, "updated cart_id");
        assertEquals(updateData.data.product_id, "updated product_id");
        assertEquals(updateData.data.quantity, 99);
        assertEquals(updateData.data.unit_price, 99);
      });

      it("should return 404 for non-existent cartItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/cart_items/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "updated",
            product_id: "updated",
            quantity: 1,
            unit_price: 1,
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "CartItems not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "test",
            product_id: "test",
            quantity: 1,
            unit_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const cartItemsId = createData.data.id;
        testIds.push(cartItemsId);

        const response = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /cart_items/:id - Delete", () => {
      it("should delete a cartItems", async () => {
        const createResponse = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "to delete",
            product_id: "to delete",
            quantity: 1,
            unit_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const cartItemsId = createData.data.id;

        const deleteResponse = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `cart_items deleted successfully with id: ${ cartItemsId }`
        );

        const getResponse = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent cartItems", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/cart_items/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "CartItems not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/cart_items/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/cart_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_id: "test",
            product_id: "test",
            quantity: 1,
            unit_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const cartItemsId = createData.data.id;
        testIds.push(cartItemsId);

        const response = await app.request(`/cart_items/${ cartItemsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
