import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";
import { executeQuery } from "./database/db";
import {
  query_addUser,
  query_getUserByGoogleId,
  query_getUserById,
  query_updateUserName,
  query_updateUserProfilePicture,
} from "./database/queries";
import { mapUserFromDB } from "./mapper";
import { User } from "./types";

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

const addUserToRoom = async (user: User, room: string) => {
  try {
    const { rooms } = await getFormatedDataFromJSON("dist/rooms.json");
    const existingUser = rooms[room].find(
      (currentUser: User) => user.userId === currentUser.userId
    );
    if (!!existingUser) {
      rooms[room].find(
        (currentUser: User) => user.userId === currentUser.userId
      ).socketId = user.socketId;
    } else {
      rooms[room].push(user);
    }

    await writeDataToJSON("dist/rooms.json", { rooms });

    const activeUsersInRoom = rooms[room];
    return activeUsersInRoom;
  } catch (err) {
    console.log(err);
  }
};

const deleteUserFromRoom = async (user: User, room: string) => {
  try {
    const { rooms } = await getFormatedDataFromJSON("dist/rooms.json");

    const arrayWhenUserIsRemoved = rooms[room].filter((currentUser: User) => {
      return user.userId !== currentUser.userId;
    });

    rooms[room] = arrayWhenUserIsRemoved;

    await writeDataToJSON("dist/rooms.json", { rooms });
    const activeUsersInRoom = rooms[room];
    return activeUsersInRoom;
  } catch (err) {
    console.log(err);
  }
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
};
