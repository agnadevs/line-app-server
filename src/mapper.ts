import {RawMessage, RawUser} from './types'

const mapMessageFromDB = (messageObj: RawMessage) => {
  return {
    userId: messageObj.user_id,
    userName: messageObj.user_name,
    text: messageObj.text,
    timestamp: messageObj.created_date
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

export { mapMessageFromDB, mapUserFromDB };
