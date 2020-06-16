import express, { Request, Response } from "express";
import { addNewUser, getUsers, getUserById, updateUser } from "./users";
import { User } from "./types";
import { getMessagesForRoom } from "./messages";
import { connectSocket } from "./socket";
const http = require("http");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const port = 4000;

const app = express();
const server = http.createServer(app);
connectSocket(server);

app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  next();
});

app.use(express.json());

app.get("/api/healthCheck", (req: Request, res: Response) => {
  res.send({ message: "Gris" });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users: User[] = await getUsers();
    res.send({ error: null, data: users });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/users/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    res.send({ error: null, data: user });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.put("/api/users/update", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const updatedUser = await updateUser("USERNAME", data);
    res.send({ error: null, data: updatedUser });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/chat/:room", async (req: Request, res: Response) => {
  const { room } = req.params;
  try {
    const history = await getMessagesForRoom(room);
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

    const users = await getUsers();
    const existingUser = users.find((user: User) => user.userId === sub);

    if (existingUser) {
      if (existingUser.profileImageURL === picture) {
        res.send({ error: null, data: existingUser });
        return;
      }
      existingUser.profileImageURL = picture;
      const updatedUser = await updateUser("IMAGE", existingUser);
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

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

server.listen(port, () => console.log(`listening on port ${port}..`));
