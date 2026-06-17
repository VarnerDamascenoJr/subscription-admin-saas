export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  changes?: Record<string, unknown>;
  createdAt: string;
}
