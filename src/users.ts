import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";
import { executeQuery } from "./database/db";
import {
  query_addUser,
  query_getUserByGoogleId,
  query_getUserById,
  query_updateUserName,
  query_updateUserProfilePicture,
  query_addUserToRoom,
  query_deleteUserFromRoom,
  query_getActiveUsersInRoom,
} from "./database/queries";
import { mapUserFromDB } from "./mapper";
import { User, RawUser } from "./types";

// UPDATED TO USE DATABASE
const addNewUser = async (
  sub: string,
  given_name: string,
  family_name: string,
  name: string,
  picture: string
) => {
  try {
    const response = await executeQuery(query_addUser, [
      sub,
      name,
      given_name,
      family_name,
      picture,
    ]);
    return mapUserFromDB(response.rows[0]);
  } catch (err) {
    console.log(err);
  }
};

const getUserByGoogleId = async (id: string) => {
  const response = await executeQuery(query_getUserByGoogleId, [id]);
  return !!response.rows.length ? mapUserFromDB(response.rows[0]) : null;
};

const updateUserName = async (id: number, newUserName: string) => {
  const response = await executeQuery(query_updateUserName, [id, newUserName]);
  return mapUserFromDB(response.rows[0]);
};

const updateUserProfilePicture = async (id: number, pictureURL: string) => {
  const response = await executeQuery(query_updateUserProfilePicture, [
    id,
    pictureURL,
  ]);
  return mapUserFromDB(response.rows[0]);
};

const addUserToRoom = async (
  userId: number,
  socketId: string,
  roomId: string
) => {
  try {
    await executeQuery(query_addUserToRoom, [userId, socketId, roomId]);
    //   const { rooms } = await getFormatedDataFromJSON("dist/rooms.json");
    //   const existingUser = rooms[room].find(
    //     (currentUser: User) => user.userId === currentUser.userId
    //   );
    //   if (!!existingUser) {
    //     rooms[room].find(
    //       (currentUser: User) => user.userId === currentUser.userId
    //     ).socketId = user.socketId;
    //   } else {
    //     rooms[room].push(user);
    //   }
    //   await writeDataToJSON("dist/rooms.json", { rooms });
    //   const activeUsersInRoom = rooms[room];
    // return activeUsersInRoom;
  } catch (err) {
    console.log(err);
  }
};

const deleteUserFromRoom = async (socketId: string) => {
  try {
    await executeQuery(query_deleteUserFromRoom, [socketId]);
  } catch (err) {
    console.log(err);
  }
};

const getActiveUsersInRoom = async (roomId: string) => {
  const activeUsers = await executeQuery(query_getActiveUsersInRoom, [roomId]);
  const mappedUsers = activeUsers.rows.map((user: RawUser) => {
    return mapUserFromDB(user);
  });
  return mappedUsers;
};

const getUserById = async (id: number) => {
  const response = await executeQuery(query_getUserById, [id]);
  return !!response.rows.length ? response.rows[0] : null;
};

export {
  addNewUser,
  getUserByGoogleId,
  getUserById,
  addUserToRoom,
  deleteUserFromRoom,
  updateUserName,
  updateUserProfilePicture,
  getActiveUsersInRoom,
};
