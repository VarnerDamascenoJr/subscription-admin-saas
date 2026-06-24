import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const organizationHeadersSchema = z.object({
  "x-organization-id": z.string().uuid(),
});

export function getOrganizationId(request: FastifyRequest, reply: FastifyReply) {
  const parsedHeaders = organizationHeadersSchema.safeParse(request.headers);

  if (!parsedHeaders.success) {
    reply.status(400).send({
      message:
        "Organization is not configured for this request. Provide a valid x-organization-id header.",
      issues: parsedHeaders.error.issues,
    });
    return null;
  }

  return parsedHeaders.data["x-organization-id"];
}
