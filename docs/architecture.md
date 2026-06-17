# Architecture Notes

## High-Level Modules

- auth
- dashboard
- customers
- plans
- subscriptions
- invoices
- activity
- audit log

## Suggested Application Layout

```text
apps/web
  src/
    app/
    components/
    features/
    lib/
    server/
```

## Initial Domain Entities

- User
- Organization
- Role
- Customer
- Plan
- Subscription
- Invoice
- Payment
- Note
- ActivityEvent
- AuditLog

## Technical Priorities

- type safety across the stack
- strong server-side data modeling
- reusable admin UI patterns
- clear separation between domain logic and presentation
- production-friendly configuration
