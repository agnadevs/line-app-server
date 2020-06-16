import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";
import { executeQuery } from "./database/db";
import { query_addUser, query_getUserByGoogleId } from "./database/queries";
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
    return response.rows[0];
  } catch (err) {
    console.log(err);
  }
};

// UPDATED TO USE DATABASE
const getUserByGoogleId = async (id: string) => {
  const response = await executeQuery(query_getUserByGoogleId, [id]);
  console.log(response);
  return !!response.rows.length ? response.rows[0] : null;
};

const getUsers = async () => {
  const { users } = await getFormatedDataFromJSON("dist/users.json");
  return users;
};

const getUserById = async (id: string) => {
  const users = await getUsers();
  const user = users.find((user: User) => user.userId === id);
  return user;
};

type UpdateUser = {
  userId: string;
  userName?: string;
  profileImageURL?: string;
};

const updateUser = async (type: string, userObj: UpdateUser) => {
  const users = await getUsers();
  const targetUser = users.find((user: User) => user.userId === userObj.userId);
  const index = users.indexOf(targetUser);
  switch (type) {
    case "USERNAME":
      targetUser.userName = userObj.userName;
      break;
    case "IMAGE":
      targetUser.profileImageURL = userObj.profileImageURL;
      break;
  }
  if (index !== -1) {
    users[index] = targetUser;
  }

  await writeDataToJSON("dist/users.json", { users });

  return targetUser;
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

export {
  addNewUser,
  getUserByGoogleId,
  getUsers,
  getUserById,
  addUserToRoom,
  deleteUserFromRoom,
  updateUser,
};
