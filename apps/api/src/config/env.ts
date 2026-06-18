function readNumber(name: string, fallback: number) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return parsedValue;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  API_PORT: readNumber("API_PORT", 4000),
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/subscription_admin_saas",
};
