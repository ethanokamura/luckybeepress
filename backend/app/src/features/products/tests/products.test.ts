import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { productsRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "Products API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/products", productsRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM products WHERE id = $1", [id]);
      }
    });

    describe("POST /products - Create", () => {
      it("should create a new products with all fields", async () => {
        const newProducts = {
          sku: "test value",
          name: "test value",
          description: "test value",
          category: "test value",
          wholesale_price: 42,
          suggested_retail_price: 42,
          cost: 42,
          is_active: false,
          minimum_order_quantity: 42,
          has_box: false,
          stock_quantity: 42,
          low_stock_threshold: 42,
          image_url: "test value",
          weight_oz: 42,
        };

        const response = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProducts),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.sku, newProducts.sku);
        assertEquals(data.data.name, newProducts.name);
        assertEquals(data.data.wholesale_price, newProducts.wholesale_price);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a products with only required fields", async () => {
        const newProducts = {
          sku: "test value",
          name: "test value",
          description: "test value",
          category: "test value",
          wholesale_price: 42,
          suggested_retail_price: 42,
          cost: 42,
          is_active: false,
          minimum_order_quantity: 42,
          has_box: false,
          stock_quantity: 42,
          low_stock_threshold: 42,
          image_url: "test value",
          weight_oz: 42,
        };

        const response = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProducts),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.sku, newProducts.sku);
        assertEquals(data.data.name, newProducts.name);
        assertEquals(data.data.wholesale_price, newProducts.wholesale_price);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidProducts = {
          // Missing required fields
        };

        const response = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidProducts),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /products/:id - Read Single", () => {
      it("should get a products by ID", async () => {
        const createResponse = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "test sku",
            name: "test name",
            wholesale_price: 42,
          }),
        });

        const createData = await createResponse.json();
        const productsId = createData.data.id;
        testIds.push(productsId);

        const response = await app.request(`/products/${ productsId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, productsId);
      });

      it("should return 404 for non-existent products", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/products/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Products not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/products/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /products - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            sku: "test sku 1",
            name: "test name 1",
            wholesale_price: 1,
          },
          {
            sku: "test sku 2",
            name: "test name 2",
            wholesale_price: 2,
          },
          {
            sku: "test sku 3",
            name: "test name 3",
            wholesale_price: 3,
          },
          {
            sku: "test sku 4",
            name: "test name 4",
            wholesale_price: 4,
          },
          {
            sku: "test sku 5",
            name: "test name 5",
            wholesale_price: 5,
          },
        ];

        for (const item of testData) {
          const response = await app.request("/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of products", async () => {
        const response = await app.request("/products?limit=10", {
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
        const response = await app.request("/products?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/products?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /products/:id - Update", () => {
      it("should update products fields", async () => {
        const createResponse = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "original sku",
            name: "original name",
            wholesale_price: 10,
          }),
        });

        const createData = await createResponse.json();
        const productsId = createData.data.id;
        testIds.push(productsId);

        const updateResponse = await app.request(`/products/${ productsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "updated sku",
            name: "updated name",
            wholesale_price: 99,
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, productsId);
        assertEquals(updateData.data.sku, "updated sku");
        assertEquals(updateData.data.name, "updated name");
        assertEquals(updateData.data.wholesale_price, 99);
      });

      it("should return 404 for non-existent products", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/products/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "updated",
            name: "updated",
            wholesale_price: 1,
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Products not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "test",
            name: "test",
            wholesale_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const productsId = createData.data.id;
        testIds.push(productsId);

        const response = await app.request(`/products/${ productsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /products/:id - Delete", () => {
      it("should delete a products", async () => {
        const createResponse = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "to delete",
            name: "to delete",
            wholesale_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const productsId = createData.data.id;

        const deleteResponse = await app.request(`/products/${ productsId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `products deleted successfully with id: ${ productsId }`
        );

        const getResponse = await app.request(`/products/${ productsId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent products", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/products/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Products not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/products/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: "test",
            name: "test",
            wholesale_price: 1,
          }),
        });

        const createData = await createResponse.json();
        const productsId = createData.data.id;
        testIds.push(productsId);

        const response = await app.request(`/products/${ productsId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
