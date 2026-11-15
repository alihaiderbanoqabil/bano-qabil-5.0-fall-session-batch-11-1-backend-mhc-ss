# API setup and endpoints

Run `npm install`, configure `MONGO_URI`, and provide `JWT_SECRET` through the
environment or a local configuration file excluded from version control. Use a
private random secret of at least 32 characters; do not use the example value.
Start the server with `npm run dev`. Access tokens are sent as
`Authorization: Bearer <token>` and expire after seven days. Public registration
always creates a customer; assign the first administrator directly in MongoDB.

Successful responses use `{ "status": true, "data": ... }`. List endpoints also
return `pagination` metadata and accept `page` and `limit`; product and category
lists support `search`, `sort`, and filters.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/users/register` | Public | Register with `name`, `email`, `password` |
| POST | `/api/users/login` | Public | Login with `email`, `password`; returns a token |
| GET/PATCH | `/api/users/me` | Signed in | Read or update own profile |
| GET | `/api/users` | Admin | List users |
| GET/PATCH/DELETE | `/api/users/:id` | Admin | Manage a user |
| GET | `/api/categories` | Public | List categories |
| GET | `/api/categories/:id` | Public | Read a category |
| POST | `/api/categories` | Admin | Create a category |
| PATCH/DELETE | `/api/categories/:id` | Admin | Update or delete a category |
| GET | `/api/products` | Public | List active products |
| GET | `/api/products/:id` | Public | Read an active product |
| POST | `/api/products` | Admin | Create a product |
| PATCH/DELETE | `/api/products/:id` | Admin | Update or deactivate a product |
| GET | `/api/ratings/product/:productId` | Public | List product ratings |
| GET | `/api/ratings/me` | Signed in | List own ratings |
| POST | `/api/ratings` | Signed in | Rate a product (one rating per product/user) |
| PATCH/DELETE | `/api/ratings/:id` | Owner or admin | Update or remove a rating |
| GET/POST | `/api/orders` | Signed in | List own orders or create an order |
| GET | `/api/orders/:id` | Owner or admin | Read an order |
| POST | `/api/orders/:id/cancel` | Owner | Cancel a pending order |
| PATCH | `/api/orders/:id/status` | Admin | Advance an order to processing, shipped, or delivered |

Order item prices and totals are calculated from current product records; clients
cannot set their own prices. Product stock is checked and decremented when an
order is created.
