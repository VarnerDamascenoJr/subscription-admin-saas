export interface ActivityEvent {
  id: string;
  customerId: string;
  type: string;
  description: string;
  actorUserId?: string;
  createdAt: string;
}
