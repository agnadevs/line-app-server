import { v4 as uuidv4 } from "uuid";
import { getFormatedDataFromJSON, writeDataToJSON } from "./utils";

export default async (userName: string) => {
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
