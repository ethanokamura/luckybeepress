import { assertEquals, assertExists } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { Hono } from "hono";
import { addressesRouter } from "../router.ts";
import { query } from "../../../db/pool.ts";

describe(
  "Addresses API Integration Tests",
  {
    sanitizeResources: false,
    sanitizeOps: false,
  },
  () => {
    let app: Hono;
    let testIds: string[] = [];

    beforeEach(() => {
      app = new Hono();
      app.route("/addresses", addressesRouter);
      testIds = [];
    });

    afterEach(async () => {
      for (const id of testIds) {
        await query("DELETE FROM addresses WHERE id = $1", [id]);
      }
    });

    describe("POST /addresses - Create", () => {
      it("should create a new addresses with all fields", async () => {
        const newAddresses = {
          customer_id: "test value",
          address_type: "test value",
          is_default: false,
          company_name: "test value",
          street_address_1: "test value",
          street_address_2: "test value",
          city: "test value",
          state: "test value",
          postal_code: "test value",
          country: "test value",
        };

        const response = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddresses),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertExists(data.data);
        assertExists(data.data.id);
        assertEquals(data.data.customer_id, newAddresses.customer_id);
        assertEquals(data.data.address_type, newAddresses.address_type);
        assertEquals(data.data.street_address_1, newAddresses.street_address_1);
        assertEquals(data.data.city, newAddresses.city);
        assertEquals(data.data.state, newAddresses.state);
        assertEquals(data.data.postal_code, newAddresses.postal_code);
        assertExists(data.data.created_at);
        assertExists(data.data.updated_at);

        testIds.push(data.data.id);
      });

      it("should create a addresses with only required fields", async () => {
        const newAddresses = {
          customer_id: "test value",
          address_type: "test value",
          is_default: false,
          company_name: "test value",
          street_address_1: "test value",
          street_address_2: "test value",
          city: "test value",
          state: "test value",
          postal_code: "test value",
          country: "test value",
        };

        const response = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddresses),
        });

        const data = await response.json();

        assertEquals(response.status, 201);
        assertEquals(data.success, true);
        assertEquals(data.data.customer_id, newAddresses.customer_id);
        assertEquals(data.data.address_type, newAddresses.address_type);
        assertEquals(data.data.street_address_1, newAddresses.street_address_1);
        assertEquals(data.data.city, newAddresses.city);
        assertEquals(data.data.state, newAddresses.state);
        assertEquals(data.data.postal_code, newAddresses.postal_code);

        testIds.push(data.data.id);
      });

      it("should return 400 for missing required fields", async () => {
        const invalidAddresses = {
          // Missing required fields
        };

        const response = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidAddresses),
        });

        assertEquals(response.status, 400);
      });

      it("should return 400 for invalid JSON", async () => {
        const response = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /addresses/:id - Read Single", () => {
      it("should get a addresses by ID", async () => {
        const createResponse = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test customer_id",
            address_type: "test address_type",
            street_address_1: "test street_address_1",
            city: "test city",
            state: "test state",
            postal_code: "test postal_code",
          }),
        });

        const createData = await createResponse.json();
        const addressesId = createData.data.id;
        testIds.push(addressesId);

        const response = await app.request(`/addresses/${ addressesId }`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
        assertEquals(data.data.id, addressesId);
      });

      it("should return 404 for non-existent addresses", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/addresses/${fakeId}`, {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Addresses not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/addresses/invalid-uuid", {
          method: "GET",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("GET /addresses - List with Pagination", () => {
      beforeEach(async () => {
        const testData = [
          {
            customer_id: "test customer_id 1",
            address_type: "test address_type 1",
            street_address_1: "test street_address_1 1",
            city: "test city 1",
            state: "test state 1",
            postal_code: "test postal_code 1",
          },
          {
            customer_id: "test customer_id 2",
            address_type: "test address_type 2",
            street_address_1: "test street_address_1 2",
            city: "test city 2",
            state: "test state 2",
            postal_code: "test postal_code 2",
          },
          {
            customer_id: "test customer_id 3",
            address_type: "test address_type 3",
            street_address_1: "test street_address_1 3",
            city: "test city 3",
            state: "test state 3",
            postal_code: "test postal_code 3",
          },
          {
            customer_id: "test customer_id 4",
            address_type: "test address_type 4",
            street_address_1: "test street_address_1 4",
            city: "test city 4",
            state: "test state 4",
            postal_code: "test postal_code 4",
          },
          {
            customer_id: "test customer_id 5",
            address_type: "test address_type 5",
            street_address_1: "test street_address_1 5",
            city: "test city 5",
            state: "test state 5",
            postal_code: "test postal_code 5",
          },
        ];

        for (const item of testData) {
          const response = await app.request("/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          const data = await response.json();
          testIds.push(data.data.id);
        }
      });

      it("should get paginated list of addresses", async () => {
        const response = await app.request("/addresses?limit=10", {
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
        const response = await app.request("/addresses?limit=3", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.data.length <= 3, true);
      });

      it("should support ordering", async () => {
        const response = await app.request("/addresses?limit=5&order=asc", {
          method: "GET",
        });

        const data = await response.json();

        assertEquals(response.status, 200);
        assertEquals(data.success, true);
      });
    });

    describe("PATCH /addresses/:id - Update", () => {
      it("should update addresses fields", async () => {
        const createResponse = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "original customer_id",
            address_type: "original address_type",
            street_address_1: "original street_address_1",
            city: "original city",
            state: "original state",
            postal_code: "original postal_code",
          }),
        });

        const createData = await createResponse.json();
        const addressesId = createData.data.id;
        testIds.push(addressesId);

        const updateResponse = await app.request(`/addresses/${ addressesId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "updated customer_id",
            address_type: "updated address_type",
            street_address_1: "updated street_address_1",
            city: "updated city",
            state: "updated state",
            postal_code: "updated postal_code",
          }),
        });

        const updateData = await updateResponse.json();

        assertEquals(updateResponse.status, 200);
        assertEquals(updateData.success, true);
        assertEquals(updateData.data.id, addressesId);
        assertEquals(updateData.data.customer_id, "updated customer_id");
        assertEquals(updateData.data.address_type, "updated address_type");
        assertEquals(updateData.data.street_address_1, "updated street_address_1");
        assertEquals(updateData.data.city, "updated city");
        assertEquals(updateData.data.state, "updated state");
        assertEquals(updateData.data.postal_code, "updated postal_code");
      });

      it("should return 404 for non-existent addresses", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/addresses/${fakeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "updated",
            address_type: "updated",
            street_address_1: "updated",
            city: "updated",
            state: "updated",
            postal_code: "updated",
          }),
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Addresses not found");
      });

      it("should return 400 for empty update", async () => {
        const createResponse = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test",
            address_type: "test",
            street_address_1: "test",
            city: "test",
            state: "test",
            postal_code: "test",
          }),
        });

        const createData = await createResponse.json();
        const addressesId = createData.data.id;
        testIds.push(addressesId);

        const response = await app.request(`/addresses/${ addressesId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        assertEquals(response.status, 400);
      });
    });

    describe("DELETE /addresses/:id - Delete", () => {
      it("should delete a addresses", async () => {
        const createResponse = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "to delete",
            address_type: "to delete",
            street_address_1: "to delete",
            city: "to delete",
            state: "to delete",
            postal_code: "to delete",
          }),
        });

        const createData = await createResponse.json();
        const addressesId = createData.data.id;

        const deleteResponse = await app.request(`/addresses/${ addressesId }`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        assertEquals(deleteResponse.status, 200);
        assertEquals(deleteData.success, true);
        assertExists(deleteData.message);
        assertEquals(
          deleteData.message,
          `addresses deleted successfully with id: ${ addressesId }`
        );

        const getResponse = await app.request(`/addresses/${ addressesId }`, {
          method: "GET",
        });

        assertEquals(getResponse.status, 404);
      });

      it("should return 404 for non-existent addresses", async () => {
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";

        const response = await app.request(`/addresses/${fakeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        assertEquals(response.status, 404);
        assertEquals(data.success, false);
        assertEquals(data.error, "Addresses not found");
        assertEquals(data.code, "NOT_FOUND");
      });

      it("should return 400 for invalid UUID format", async () => {
        const response = await app.request("/addresses/invalid-uuid", {
          method: "DELETE",
        });

        assertEquals(response.status, 400);
      });
    });

    describe("Error Handling", () => {
      it("should handle malformed JSON in POST", async () => {
        const response = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });

      it("should handle malformed JSON in PATCH", async () => {
        const createResponse = await app.request("/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: "test",
            address_type: "test",
            street_address_1: "test",
            city: "test",
            state: "test",
            postal_code: "test",
          }),
        });

        const createData = await createResponse.json();
        const addressesId = createData.data.id;
        testIds.push(addressesId);

        const response = await app.request(`/addresses/${ addressesId }`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{invalid json}",
        });

        assertEquals(response.status, 400);
      });
    });
  }
);
