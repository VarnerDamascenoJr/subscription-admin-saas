# API Contract Draft

## Initial Endpoints

### Health

- `GET /health`

### Customers

- `GET /customers`
- `GET /customers/:customerId`
- `POST /customers`
- `PATCH /customers/:customerId`
- `POST /customers/:customerId/archive`

### Plans

- `GET /plans`
- `POST /plans`
- `PATCH /plans/:planId`

### Subscriptions

- `GET /subscriptions`
- `POST /subscriptions`
- `POST /subscriptions/:subscriptionId/change-plan`
- `POST /subscriptions/:subscriptionId/pause`
- `POST /subscriptions/:subscriptionId/cancel`

### Invoices

- `GET /invoices`
- `GET /invoices/:invoiceId`
- `PATCH /invoices/:invoiceId`

### Dashboard

- `GET /dashboard/summary`

## Notes

- all endpoints will be organization-scoped
- all write endpoints will be authenticated
- role checks will be enforced at the service layer
- Prisma will be the persistence layer behind the service modules
