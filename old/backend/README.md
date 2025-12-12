# BentoLabs Server

## Backend

To run the deno server, the set up is straight forward, ensure you have `docker` installed on your local machine and then navigate to the backend directory (`<root>/backend`)

Now,  simply run `docker compose up --build` to build and run the server. If you have already built the server and no new changes have been made, you may simply run `docker compose up`

Note — to see the new changes made in the server, you must kill the docker instance with `^C` and rebuild using `docker compose up --build`

## Database

For our database, we chose to use an instance of Postgres through neondb. Neon offers a serverless, highly scalable solution to hosting our database. It has a generous free tier that is perfect for the purpose of this application.

To set up the database connection, create a Neon account at neon.tech and create a new project. Copy your connection string and add it to your environment file at `backend/.env`:

```
DATABASE_URL=postgresql://username:password@hostname.neon.tech:5432/database_name
```

Once configured, run `docker compose exec deno-app deno run --allow-net --allow-env --allow-read src/db/setup.ts` to create all database tables including users, boards, activities, and related tables.

**Using the PostgreSQL Connection Pool:**
The backend uses a PostgreSQL connection pool configured in `backend/node/src/db/pool.js` that automatically manages database connections for optimal performance. To use the database in your controllers, import the query helper function with `const { query } = require('../../db/pool');`. Execute queries using `await query('SELECT * FROM users')` for basic queries or `await query('INSERT INTO users (email) VALUES ($1)', [email])` for parameterized queries. The pool handles connection management automatically, so you don't need to manually open or close connections.
