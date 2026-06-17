# Subscription Admin SaaS

A B2B SaaS platform for managing customers, subscriptions, invoices, account activity, and internal operations.

This project is being built as a portfolio-grade product focused on senior full-stack engineering practices: clear architecture, strong UX, business workflows, and production-minded foundations.

## Product Direction

The platform is designed for internal business teams such as:

- operations
- finance
- support
- account managers

Core outcomes:

- manage customers and subscription plans
- track invoice and payment status
- assign account ownership
- review account history and activity
- monitor operational and revenue KPIs

## MVP Scope

- authentication
- role-based access control
- admin dashboard with core KPIs
- customers management
- subscription plans management
- subscriptions management
- invoices and payment status tracking
- activity timeline
- audit log
- search, filters, sorting, and pagination

## Planned Stack

- Frontend: Next.js + TypeScript
- Backend: Next.js API routes or route handlers
- Database: PostgreSQL
- ORM: Prisma or Drizzle
- Auth: NextAuth or Clerk
- Payments: Stripe
- Testing: Vitest + Playwright
- Infra: Docker

## Repository Structure

```text
apps/
  web/
docs/
```

## Initial Roadmap

1. define product entities and flows
2. scaffold frontend and backend app
3. implement authentication and roles
4. build customer and subscription modules
5. build invoice and account activity flows
6. add tests, polish, and deployment

## Status

This repository currently contains the product foundation and architecture documents. The app scaffold will be added in the next step after the environment is upgraded to a modern Node.js toolchain.
