import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";
import { User } from "./types";

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
  userName?:string;
  profileImageURL?:string;
}

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
}

const updateUserOld = async (userId: string, userName: string) => {
  const users = await getUsers();
  const targetUser = users.find((user: User) => user.userId === userId);
  const index = users.indexOf(targetUser);
  targetUser.userName = userName;
  if (index !== -1) {
    users[index] = targetUser;
  }
  await writeDataToJSON("dist/users.json", { users });

  return targetUser;
};

const addNewUser = async (
  sub: string,
  given_name: string,
  family_name: string,
  name: string,
  picture: string
) => {
  try {
    const users = await getUsers();
    const newUser = {
      userName: name,
      firstName: given_name,
      lastName: family_name,
      userId: sub,
      profileImageURL: picture,
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

export {
  addNewUser,
  getUsers,
  getUserById,
  addUserToRoom,
  deleteUserFromRoom,
  updateUser,
};
