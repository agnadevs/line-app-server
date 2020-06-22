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
  query_getOneUserFromRoom,
  query_updateOneUserInRoom,
  query_getSocketIds,
} from "./database/queries";
import { mapUserFromDB } from "./mapper";
import { User, RawUser } from "./types";

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
    const userExists = await executeQuery(query_getOneUserFromRoom, [
      userId,
      parseInt(roomId),
    ]);
    if (!!userExists.rows.length) {
      await executeQuery(query_updateOneUserInRoom, [
        userId,
        socketId,
        parseInt(roomId),
      ]);
      return;
    }
    await executeQuery(query_addUserToRoom, [
      userId,
      socketId,
      parseInt(roomId),
    ]);
  } catch (err) {
    console.log(err);
  }
};

const getAllSocketIds = async () => {
  try {
    const socketIdsInDb = await executeQuery(query_getSocketIds, []);
    return socketIdsInDb.rows.map((row: { socket_id: string }) => {
      return row.socket_id;
    });
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
  const activeUsers = await executeQuery(query_getActiveUsersInRoom, [
    parseInt(roomId),
  ]);
  const mappedUsers = activeUsers.rows.map((user: RawUser) => {
    return mapUserFromDB(user);
  });
  return mappedUsers;
};

const removeInactiveSockets = async (
  activeSockets: string[],
  databaseSockets: string[]
) => {
  databaseSockets.forEach(async (socketId) => {
    if (!activeSockets.includes(socketId)) {
      await executeQuery(query_deleteUserFromRoom, [socketId]);
      console.info(`Removed inactive socket: '${socketId}' at: ${new Date()}`);
    }
  });
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
  getAllSocketIds,
  removeInactiveSockets,
};
