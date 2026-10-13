// Mirrors Lifecome-backend's `AdminThreadRow` and `Message` (src/modules/messaging/messaging.service.ts).
export type MessageTopic = "booking_payments" | "online_appointment" | "clinic_visit" | "follow_up";

export interface MessageThread {
  id: string;
  patientId: string;
  patientName: string;
  subject: string | null;
  topic: MessageTopic | null;
  createdAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface Message {
  id: string;
  threadId: string;
  senderType: "patient" | "care_team";
  senderId: string;
  body: string;
  sentAt: string;
}

export interface MessageThreadDetail extends MessageThread {
  messages: Message[];
}

export const topicLabel: Record<MessageTopic, string> = {
  booking_payments: "Booking and payments",
  online_appointment: "Online appointment",
  clinic_visit: "Clinic visit",
  follow_up: "Follow-up query",
};
