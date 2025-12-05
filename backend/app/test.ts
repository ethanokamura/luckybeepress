import { Hono } from "hono";

const app = new Hono();

app.get("/test", (c) => {
  console.log("Test endpoint hit!");
  return c.json({ status: "ok" });
});

console.log("Starting test server on :3002");
Deno.serve({ port: 3002, hostname: "0.0.0.0" }, app.fetch);
