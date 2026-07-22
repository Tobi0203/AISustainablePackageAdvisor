# Sustainable Packaging Advisor API

## Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and a secure `JWT_SECRET`.
2. Run `npm install` from this `backend` folder.
3. Run `npm run dev` for development or `npm start` for production.

Base URL: `/api/v1`. Authentication accepts an HTTP-only cookie or `Authorization: Bearer <token>`.

## API endpoints

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `PATCH /users/me`; admin: `GET /users`, `PATCH /users/:id/status`
- `GET /suppliers`, `GET /suppliers/:id`; supplier: `GET|PATCH /suppliers/me`; admin: `PATCH /suppliers/:id/verification`
- `GET /products`, `GET /products/:id`; supplier: `POST /products`, `PATCH|DELETE /products/:id`
- `GET /quotes`, customer: `POST /quotes`, owner/admin: `PATCH /quotes/:id`
- customer: `GET|POST /favorites`, `DELETE /favorites/:productId`

All list endpoints return JSON. Products and suppliers support pagination with `page` and `limit`; products support `search`, `category`, `material`, and `minScore` filters.
