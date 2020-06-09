import { v4 as uuidv4 } from "uuid";
import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";

type Message = {
  text: string;
  userName: string;
  userId: string;
  timestamp: string;
  roomId: string;
}

const getMessagesForRoom = async (room: string) => {
  const { messages } = await getFormatedDataFromJSON("dist/chatHistory.json");
  return messages.filter((msg: Message) => msg.roomId === room);
}

const addNewMessage = async (message: Message, room: string) => {
  try {
    const { messages } = await getFormatedDataFromJSON("dist/chatHistory.json");

    const newMessage = {
      text: message.text,
      userName: message.userName,
      userId: message.userId,
      timestamp: message.timestamp,
      roomId: room
    };
    messages.push(newMessage);

    await writeDataToJSON("dist/chatHistory.json", { messages });

    return message;
  } catch (err) {
    console.log(err);
  }
};

export {addNewMessage, getMessagesForRoom}
