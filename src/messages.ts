import { query_addMessage, query_getMessagesForRoom } from "./database/queries";
import { executeQuery } from "./database/db";
import { mapMessageFromDB } from "./mapper";
import { RawMessage, ChatMessage } from "./types";

const getMessagesForRoom = async (roomId: string) => {
  const messages = await executeQuery(query_getMessagesForRoom, [roomId]);
  const mappedMessages = messages.rows.map((message: RawMessage) => {
    return mapMessageFromDB(message);
  });

  return mappedMessages;
};

const addNewMessage = async (message: ChatMessage, room: string) => {
  const { userId, text } = message;
  try {
    const message = await executeQuery(query_addMessage, [userId, room, text]);
    return mapMessageFromDB(message.rows[0]);
  } catch (err) {
    console.log(err);
  }
};

export { addNewMessage, getMessagesForRoom };
