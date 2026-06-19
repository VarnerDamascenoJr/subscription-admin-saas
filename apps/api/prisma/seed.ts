import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Acme Operations",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@acme-ops.com" },
    update: {},
    create: {
      id: "22222222-2222-2222-2222-222222222222",
      organizationId: organization.id,
      name: "Olivia Admin",
      email: "admin@acme-ops.com",
      role: "ADMIN",
    },
  });

  const customer = await prisma.customer.upsert({
    where: { id: "33333333-3333-3333-3333-333333333333" },
    update: {},
    create: {
      id: "33333333-3333-3333-3333-333333333333",
      organizationId: organization.id,
      ownerUserId: adminUser.id,
      name: "Northwind Logistics",
      legalName: "Northwind Logistics Ltd.",
      email: "ops@northwind-logistics.com",
      phone: "+55 85 99999-0000",
      status: "ACTIVE",
      notes: "Priority B2B customer for initial seed data.",
    },
  });

  const plan = await prisma.plan.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "GROWTH-MONTHLY",
      },
    },
    update: {},
    create: {
      id: "44444444-4444-4444-4444-444444444444",
      organizationId: organization.id,
      name: "Growth",
      code: "GROWTH-MONTHLY",
      description: "Monthly plan for growing operations teams.",
      priceInCents: 19900,
      currency: "BRL",
      billingInterval: "MONTHLY",
      status: "ACTIVE",
    },
  });

  const subscription = await prisma.subscription.upsert({
    where: { id: "55555555-5555-5555-5555-555555555555" },
    update: {},
    create: {
      id: "55555555-5555-5555-5555-555555555555",
      organizationId: organization.id,
      customerId: customer.id,
      planId: plan.id,
      status: "ACTIVE",
      startsAt: new Date("2026-06-01T00:00:00.000Z"),
      renewsAt: new Date("2026-07-01T00:00:00.000Z"),
    },
  });

  await prisma.invoice.upsert({
    where: { id: "66666666-6666-6666-6666-666666666666" },
    update: {},
    create: {
      id: "66666666-6666-6666-6666-666666666666",
      organizationId: organization.id,
      customerId: customer.id,
      subscriptionId: subscription.id,
      status: "OPEN",
      amountInCents: 19900,
      currency: "BRL",
      dueAt: new Date("2026-07-05T00:00:00.000Z"),
    },
  });

  await prisma.activityEvent.upsert({
    where: { id: "77777777-7777-7777-7777-777777777777" },
    update: {},
    create: {
      id: "77777777-7777-7777-7777-777777777777",
      organizationId: organization.id,
      customerId: customer.id,
      actorUserId: adminUser.id,
      type: "CUSTOMER_CREATED",
      description: "Customer account was created and assigned to Olivia Admin.",
    },
  });

  await prisma.auditLog.upsert({
    where: { id: "88888888-8888-8888-8888-888888888888" },
    update: {},
    create: {
      id: "88888888-8888-8888-8888-888888888888",
      organizationId: organization.id,
      actorUserId: adminUser.id,
      entityType: "Customer",
      entityId: customer.id,
      action: "CREATE",
      changes: {
        name: customer.name,
        status: customer.status,
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
