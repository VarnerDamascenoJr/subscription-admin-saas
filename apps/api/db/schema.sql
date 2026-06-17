create table organizations (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  name text not null,
  email text not null unique,
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  owner_user_id uuid references users (id),
  name text not null,
  legal_name text,
  email text not null,
  phone text,
  status text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table plans (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  name text not null,
  code text not null,
  description text,
  price_in_cents integer not null,
  currency text not null,
  billing_interval text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table subscriptions (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  customer_id uuid not null references customers (id),
  plan_id uuid not null references plans (id),
  status text not null,
  starts_at timestamptz not null,
  renews_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  customer_id uuid not null references customers (id),
  subscription_id uuid references subscriptions (id),
  status text not null,
  amount_in_cents integer not null,
  currency text not null,
  due_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity_events (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  customer_id uuid not null references customers (id),
  actor_user_id uuid references users (id),
  type text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key,
  organization_id uuid not null references organizations (id),
  actor_user_id uuid not null references users (id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  changes jsonb,
  created_at timestamptz not null default now()
);
