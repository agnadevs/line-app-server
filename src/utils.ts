import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getFormatedDataFromJSON = async (path: string): Promise<any> => {
  try {
    const jsonObject = await readFile(path, "utf8");
    return JSON.parse(jsonObject);
  } catch (err) {
    throw new Error(err);
  }
};

const writeDataToJSON = async (path: string, data: any): Promise<any> => {
  try {
    const stringifiedData = JSON.stringify(data);
    await writeFile(path, stringifiedData);
  } catch (err) {
    throw new Error(err);
  }
};

export { getFormatedDataFromJSON, writeDataToJSON };
