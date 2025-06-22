import { Message } from "../server.js";

export async function saveMessage(messageData) {
  return await Message.create(messageData);
}

export async function getMessagesByUser(userId) {
  return await Message.find({ userId }).sort({ createdAt: 1 });
}
