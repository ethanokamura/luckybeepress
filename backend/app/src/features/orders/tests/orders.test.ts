import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { ordersRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "Orders API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/orders", ordersRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM orders WHERE id = $1", [id]);
      }
    });

    describe("POST /orders - Create", () => {
      it("should create a new orders with all fields", async () => {
        const newOrders = {
          order_number: "test value",
          customer_id: "test value",
          shipping_company_name: "test value",
          shipping_address_1: "test value",
          shipping_address_2: "test value",
          shipping_city: "test value",
          shipping_state: "test value",
          shipping_postal_code: "test value",
          shipping_country: "test value",
          shipping_phone: "test value",
          billing_company_name: "test value",
          billing_address_1: "test value",
          billing_address_2: "test value",
          billing_city: "test value",
          billing_state: "test value",
          billing_postal_code: "test value",
          billing_country: "test value",
          subtotal: 42,
          shipping_cost: 42,
          tax_amount: 42,
          discount_amount: 42,
          total_amount: 42,
          status: "test value",
          payment_status: "test value",
          payment_method: "test value",
          payment_due_date: new Date(),
          order_date: new Date(),
          ship_date: new Date(),
          delivery_date: new Date(),
          cancelled_date: new Date(),
          tracking_number: "test value",
          carrier: "test value",
          internal_notes: "test value",
          customer_notes: "test value",
        };

        const response = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrders),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.order_number, newOrders.order_number);
        assertEquals(data.data.customer_id, newOrders.customer_id);
        assertEquals(data.data.shipping_address_1, newOrders.shipping_address_1);
        assertEquals(data.data.shipping_city, newOrders.shipping_city);
        assertEquals(data.data.shipping_state, newOrders.shipping_state);
        assertEquals(data.data.shipping_postal_code, newOrders.shipping_postal_code);
        assertEquals(data.data.shipping_country, newOrders.shipping_country);
        assertEquals(data.data.subtotal, newOrders.subtotal);
        assertEquals(data.data.total_amount, newOrders.total_amount);
        assertEquals(data.data.order_date, newOrders.order_date);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a orders with only required fields", async () => {
        const newOrders = {
          order_number: "test value",
          customer_id: "test value",
          shipping_company_name: "test value",
          shipping_address_1: "test value",
          shipping_address_2: "test value",
          shipping_city: "test value",
          shipping_state: "test value",
          shipping_postal_code: "test value",
          shipping_country: "test value",
          shipping_phone: "test value",
          billing_company_name: "test value",
          billing_address_1: "test value",
          billing_address_2: "test value",
          billing_city: "test value",
          billing_state: "test value",
          billing_postal_code: "test value",
          billing_country: "test value",
          subtotal: 42,
          shipping_cost: 42,
          tax_amount: 42,
          discount_amount: 42,
          total_amount: 42,
          status: "test value",
          payment_status: "test value",
          payment_method: "test value",
          payment_due_date: new Date(),
          order_date: new Date(),
          ship_date: new Date(),
          delivery_date: new Date(),
          cancelled_date: new Date(),
          tracking_number: "test value",
          carrier: "test value",
          internal_notes: "test value",
          customer_notes: "test value",
        };

        const response = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrders),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.order_number, newOrders.order_number);
        assertEquals(data.data.customer_id, newOrders.customer_id);
        assertEquals(data.data.shipping_address_1, newOrders.shipping_address_1);
        assertEquals(data.data.shipping_city, newOrders.shipping_city);
        assertEquals(data.data.shipping_state, newOrders.shipping_state);
        assertEquals(data.data.shipping_postal_code, newOrders.shipping_postal_code);
        assertEquals(data.data.shipping_country, newOrders.shipping_country);
        assertEquals(data.data.subtotal, newOrders.subtotal);
        assertEquals(data.data.total_amount, newOrders.total_amount);
        assertEquals(data.data.order_date, newOrders.order_date);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidOrders = {
          // Missing required fields
        };

        const response = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidOrders),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /orders/:id - Read Single", () => {
      it("should get a orders by ID", async () => {
        const createResponse = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "test order_number",
            customer_id: "test customer_id",
            shipping_address_1: "test shipping_address_1",
            shipping_city: "test shipping_city",
            shipping_state: "test shipping_state",
            shipping_postal_code: "test shipping_postal_code",
            shipping_country: "test shipping_country",
            subtotal: 42,
            total_amount: 42,
            order_date: new Date(),
          }),
        });

        const createData = await createResponse.json();
        const ordersId = createData.data.id;
        testIds.push(ordersId);

        const response = await app.request(`/orders/${ ordersId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, ordersId);
      });

      it("should return 404 for non-existent orders", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/orders/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Orders not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/orders/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /orders - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            order_number: "test order_number 1",
            customer_id: "test customer_id 1",
            shipping_address_1: "test shipping_address_1 1",
            shipping_city: "test shipping_city 1",
            shipping_state: "test shipping_state 1",
            shipping_postal_code: "test shipping_postal_code 1",
            shipping_country: "test shipping_country 1",
            subtotal: 1,
            total_amount: 1,
            order_date: new Date(),
          },
          {
            order_number: "test order_number 2",
            customer_id: "test customer_id 2",
            shipping_address_1: "test shipping_address_1 2",
            shipping_city: "test shipping_city 2",
            shipping_state: "test shipping_state 2",
            shipping_postal_code: "test shipping_postal_code 2",
            shipping_country: "test shipping_country 2",
            subtotal: 2,
            total_amount: 2,
            order_date: new Date(),
          },
          {
            order_number: "test order_number 3",
            customer_id: "test customer_id 3",
            shipping_address_1: "test shipping_address_1 3",
            shipping_city: "test shipping_city 3",
            shipping_state: "test shipping_state 3",
            shipping_postal_code: "test shipping_postal_code 3",
            shipping_country: "test shipping_country 3",
            subtotal: 3,
            total_amount: 3,
            order_date: new Date(),
          },
          {
            order_number: "test order_number 4",
            customer_id: "test customer_id 4",
            shipping_address_1: "test shipping_address_1 4",
            shipping_city: "test shipping_city 4",
            shipping_state: "test shipping_state 4",
            shipping_postal_code: "test shipping_postal_code 4",
            shipping_country: "test shipping_country 4",
            subtotal: 4,
            total_amount: 4,
            order_date: new Date(),
          },
          {
            order_number: "test order_number 5",
            customer_id: "test customer_id 5",
            shipping_address_1: "test shipping_address_1 5",
            shipping_city: "test shipping_city 5",
            shipping_state: "test shipping_state 5",
            shipping_postal_code: "test shipping_postal_code 5",
            shipping_country: "test shipping_country 5",
            subtotal: 5,
            total_amount: 5,
            order_date: new Date(),
          },
        ];

        for (const item of testData) {
          const response = await app.request("/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of orders", async () => {
        const response = await app.request("/orders?limit=10", {
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
        const response = await app.request("/orders?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/orders?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /orders/:id - Update", () => {
      it("should update orders fields", async () => {
        const createResponse = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "original order_number",
            customer_id: "original customer_id",
            shipping_address_1: "original shipping_address_1",
            shipping_city: "original shipping_city",
            shipping_state: "original shipping_state",
            shipping_postal_code: "original shipping_postal_code",
            shipping_country: "original shipping_country",
            subtotal: 10,
            total_amount: 10,
            order_date: new Date(),
          }),
        });

        const createData = await createResponse.json();
        const ordersId = createData.data.id;
        testIds.push(ordersId);

        const updateResponse = await app.request(`/orders/${ ordersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "updated order_number",
            customer_id: "updated customer_id",
            shipping_address_1: "updated shipping_address_1",
            shipping_city: "updated shipping_city",
            shipping_state: "updated shipping_state",
            shipping_postal_code: "updated shipping_postal_code",
            shipping_country: "updated shipping_country",
            subtotal: 99,
            total_amount: 99,
            order_date: new Date(),
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, ordersId);
        assertEquals(updateData.data.order_number, "updated order_number");
        assertEquals(updateData.data.customer_id, "updated customer_id");
        assertEquals(updateData.data.shipping_address_1, "updated shipping_address_1");
        assertEquals(updateData.data.shipping_city, "updated shipping_city");
        assertEquals(updateData.data.shipping_state, "updated shipping_state");
        assertEquals(updateData.data.shipping_postal_code, "updated shipping_postal_code");
        assertEquals(updateData.data.shipping_country, "updated shipping_country");
        assertEquals(updateData.data.subtotal, 99);
        assertEquals(updateData.data.total_amount, 99);
      });

      it("should return 404 for non-existent orders", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/orders/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "updated",
            customer_id: "updated",
            shipping_address_1: "updated",
            shipping_city: "updated",
            shipping_state: "updated",
            shipping_postal_code: "updated",
            shipping_country: "updated",
            subtotal: 1,
            total_amount: 1,
            order_date: null,
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Orders not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "test",
            customer_id: "test",
            shipping_address_1: "test",
            shipping_city: "test",
            shipping_state: "test",
            shipping_postal_code: "test",
            shipping_country: "test",
            subtotal: 1,
            total_amount: 1,
            order_date: null,
          }),
        });

        const createData = await createResponse.json();
        const ordersId = createData.data.id;
        testIds.push(ordersId);

        const response = await app.request(`/orders/${ ordersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /orders/:id - Delete", () => {
      it("should delete a orders", async () => {
        const createResponse = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "to delete",
            customer_id: "to delete",
            shipping_address_1: "to delete",
            shipping_city: "to delete",
            shipping_state: "to delete",
            shipping_postal_code: "to delete",
            shipping_country: "to delete",
            subtotal: 1,
            total_amount: 1,
            order_date: null,
          }),
        });

        const createData = await createResponse.json();
        const ordersId = createData.data.id;

        const deleteResponse = await app.request(`/orders/${ ordersId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `orders deleted successfully with id: ${ ordersId }`
        );

        const getResponse = await app.request(`/orders/${ ordersId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent orders", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/orders/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Orders not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/orders/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: "test",
            customer_id: "test",
            shipping_address_1: "test",
            shipping_city: "test",
            shipping_state: "test",
            shipping_postal_code: "test",
            shipping_country: "test",
            subtotal: 1,
            total_amount: 1,
            order_date: null,
          }),
        });

        const createData = await createResponse.json();
        const ordersId = createData.data.id;
        testIds.push(ordersId);

        const response = await app.request(`/orders/${ ordersId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
