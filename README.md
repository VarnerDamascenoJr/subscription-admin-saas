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
- Backend: Node.js + TypeScript API
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: NextAuth or Clerk
- Payments: Stripe
- Testing: Vitest + Playwright
- Infra: Docker

## Repository Structure

```text
apps/
  api/
  web/
docs/
```

## Initial Roadmap

1. define product entities and flows
2. scaffold backend foundation
3. scaffold frontend app
4. implement authentication and roles
5. build customer and subscription modules
6. build invoice and account activity flows
7. add tests, polish, and deployment

## Status

This repository now contains the product foundation, architecture documents, and an initial backend scaffold. Dependency installation is still pending a modern local Node.js toolchain.
