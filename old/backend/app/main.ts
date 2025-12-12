import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { Auth0Exception } from "@auth0/auth0-hono";
import { requiresAuth } from "./src/middleware/auth.ts";
import { customersRouter} from "./src/features/customers/router.ts";
import { addressesRouter} from "./src/features/addresses/router.ts";
import { productsRouter} from "./src/features/products/router.ts";
import { cartsRouter} from "./src/features/carts/router.ts";
import { cartItemsRouter} from "./src/features/cart-items/router.ts";
import { ordersRouter} from "./src/features/orders/router.ts";
import { orderItemsRouter} from "./src/features/order-items/router.ts";

const app = new Hono();
const apiVersion = Deno.env.get("API_VERSION") || "v0";

const corsOpts = {
  origin: ["https://localhost:3000", "https://www.localhost:3001"],
  credentials: true,
};

// CORS
app.use(cors(corsOpts));

app.use(`/${apiVersion}/customers/*`, requiresAuth);
app.route(`/${apiVersion}/customers`, customersRouter);
app.use(`/${apiVersion}/addresses/*`, requiresAuth);
app.route(`/${apiVersion}/addresses`, addressesRouter);
app.use(`/${apiVersion}/products/*`, requiresAuth);
app.route(`/${apiVersion}/products`, productsRouter);
app.use(`/${apiVersion}/carts/*`, requiresAuth);
app.route(`/${apiVersion}/carts`, cartsRouter);
app.use(`/${apiVersion}/cart-items/*`, requiresAuth);
app.route(`/${apiVersion}/cart-items`, cartItemsRouter);
app.use(`/${apiVersion}/orders/*`, requiresAuth);
app.route(`/${apiVersion}/orders`, ordersRouter);
app.use(`/${apiVersion}/order-items/*`, requiresAuth);
app.route(`/${apiVersion}/order-items`, orderItemsRouter);

// Errors
app.onError((err: any, c: Context) => {
  console.error("❌ Hono error:", err);
  console.error("Stack:", err.stack);
  if (err instanceof Auth0Exception) {
    return c.json(
      {
        error: "Authentication Error",
        message: err.message,
      },
      500
    );
  }
  // Handle specific error types
  if (err.type === "entity.parse.failed") {
    // JSON parsing error
    return c.json(
      {
        error: "Invalid JSON in request body",
        message: err.message,
      },
      400
    );
  }

  if (err.type === "entity.too.large") {
    // Payload too large
    return c.json(
      {
        error: "Request payload too large",
        message: err.message,
      },
      413
    );
  }

  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500
  );
});

export default app;
