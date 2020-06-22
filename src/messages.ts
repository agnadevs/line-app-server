import { query_addMessage, query_getMessagesForRoom } from "./database/queries";
import { executeQuery } from "./database/db";
import { mapMessageFromDB } from "./mapper";
import { RawMessage, ChatMessage } from "./types";

const getMessagesForRoom = async (roomId: string) => {
  const messages = await executeQuery(query_getMessagesForRoom, [
    parseInt(roomId),
  ]);
  const mappedMessages = messages.rows.map((message: RawMessage) => {
    return mapMessageFromDB(message);
  });

  return mappedMessages;
};

const addNewMessage = async (message: ChatMessage, roomId: string) => {
  const { userId, text } = message;
  try {
    const message = await executeQuery(query_addMessage, [
      userId,
      parseInt(roomId),
      text,
    ]);
    return mapMessageFromDB(message.rows[0]);
  } catch (err) {}
};

export { addNewMessage, getMessagesForRoom };
