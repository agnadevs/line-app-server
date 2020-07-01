import express, { Request, Response } from "express";
import {
  addNewUser,
  getUserByGoogleId,
  updateUserName,
  updateUserProfilePicture,
  getAllSocketIds,
  removeInactiveSockets,
  getAllUsers,
  getUsersWithAccessToRoom,
} from "./users";
import {
  getRooms,
  createPrivateRoom,
  updatePrivateRoom,
  giveAccessToRoom,
  deleteAccessToRoom,
} from "./rooms";
import { User } from "./types";
import { getMessagesForRoom } from "./messages";
import { connectSocket } from "./socket";
const http = require("http");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const port = 4000;
const io = require("socket.io")();

const app = express();
const server = http.createServer(app);
const { getActiveClients } = connectSocket(server);

setInterval(async () => {
  const activeSocketIds = await getActiveClients();
  const databaseSocketIds = await getAllSocketIds();
  await removeInactiveSockets(activeSocketIds, databaseSocketIds);
}, 300000);

app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.get("/api/healthCheck", (req: Request, res: Response) => {
  res.send({ message: "Gris" });
});

app.put("/api/users/update", async (req: Request, res: Response) => {
  try {
    const { userName, userId } = req.body;
    const updatedUser = await updateUserName(userId, userName);
    res.send({ error: null, data: updatedUser });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/rooms/:roomId/messages", async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const history = await getMessagesForRoom(roomId);
    res.send({ error: null, data: history });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const id_token = req.body.accessToken;
    const payload = await verify(id_token).catch((err) => {});
    const { sub, name, given_name, family_name, picture } = payload;

    const existingUser = await getUserByGoogleId(sub);
    if (existingUser) {
      if (existingUser.profileImageURL === picture) {
        res.send({ error: null, data: existingUser });
        return;
      }
      const { userId } = existingUser;
      const updatedUser = await updateUserProfilePicture(userId, picture);
      res.send({ error: null, data: updatedUser });
      return;
    }
    const newUser = await addNewUser(
      sub,
      given_name,
      family_name,
      name,
      picture
    );
    res.send({ error: null, data: newUser });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/rooms/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const rooms = await getRooms(userId);
    res.send({ error: null, data: rooms });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/rooms/:roomId/users", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const usersWithAccess = await getUsersWithAccessToRoom(roomId);
    const allUsers = await getAllUsers();
    const usersWithoutAccess = allUsers.filter(
      (u: User) => !usersWithAccess.find((au: User) => au.userId === u.userId)
    );
    res.send({ error: null, data: { usersWithAccess, usersWithoutAccess } });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.post("/api/rooms", async (req: Request, res: Response) => {
  const { userId, roomName } = req.body;
  try {
    const newRoom = await createPrivateRoom(userId, roomName);
    res.send({ error: null, data: newRoom });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.put("/api/rooms/:roomId/update", async (req: Request, res: Response) => {
  const { roomName } = req.body;
  const { roomId } = req.params;
  try {
    const updatedRoom = await updatePrivateRoom(roomId, roomName);
    res.send({ error: null, data: updatedRoom });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.post(
  "/api/rooms/:roomId/users/:userId",
  async (req: Request, res: Response) => {
    const { roomId, userId } = req.params;

    try {
      await giveAccessToRoom(Number(userId), Number(roomId));

      const usersWithAccess = await getUsersWithAccessToRoom(roomId);
      const allUsers = await getAllUsers();
      const usersWithoutAccess = allUsers.filter(
        (u: User) => !usersWithAccess.find((au: User) => au.userId === u.userId)
      );
      res.send({ error: null, data: { usersWithAccess, usersWithoutAccess } });
    } catch (err) {
      res.send({ error: err, data: null });
    }
  }
);

app.delete(
  "/api/rooms/:roomId/users/:userId",
  async (req: Request, res: Response) => {
    const { roomId, userId } = req.params;

    try {
      await deleteAccessToRoom(Number(userId), Number(roomId));

      const usersWithAccess = await getUsersWithAccessToRoom(roomId);
      const allUsers = await getAllUsers();
      const usersWithoutAccess = allUsers.filter(
        (u: User) => !usersWithAccess.find((au: User) => au.userId === u.userId)
      );
      res.send({ error: null, data: { usersWithAccess, usersWithoutAccess } });
    } catch (err) {
      res.send({ error: err, data: null });
    }
  }
);

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.send({ error: null, data: users });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

server.listen(port, () => console.log(`listening on port ${port}..`));
