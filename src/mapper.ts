import { RawMessage, RawUser, RawRoom } from "./types";

const mapMessageFromDB = (messageObj: RawMessage) => {
  return {
    userId: messageObj.user_id,
    userName: messageObj.user_name,
    text: messageObj.text,
    timestamp: messageObj.created_date,
  };
};

const mapUserFromDB = (userObj: RawUser) => {
  return {
    userId: userObj.id,
    userName: userObj.user_name,
    firstName: userObj.first_name,
    lastName: userObj.last_name,
    profileImageURL: userObj.profile_image_url,
  };
};

const mapRoomFromDB = (roomObj: RawRoom) => {
  return {
    roomId: roomObj.id,
    title: upperCaseFirstLetter(roomObj.room_name),
    infoText: roomObj.info_text,
    isPrivate: roomObj.is_private,
  };
};

const upperCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { mapMessageFromDB, mapUserFromDB, mapRoomFromDB };
