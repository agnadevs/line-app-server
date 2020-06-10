import { v4 as uuidv4 } from "uuid";
import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";

type User = {
  userName: string;
  userId: string;
  createdAt?: string;
  socketId?: string;
};

const getUsers = async () => {
  const { users } = await getFormatedDataFromJSON("dist/users.json");
  return users;
};

const addNewUser = async (userName: string) => {
  try {
    const { users } = await getFormatedDataFromJSON("dist/users.json");

    const newUser = {
      userName,
      userId: uuidv4(),
      createdAt: new Date(),
    };
    users.push(newUser);

    await writeDataToJSON("dist/users.json", { users });

    return newUser;
  } catch (err) {
    console.log(err);
  }
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

export { addNewUser, getUsers, addUserToRoom, deleteUserFromRoom };
