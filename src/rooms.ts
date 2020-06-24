import {
  query_getPublicRooms,
  query_createPrivateRoom,
  query_giveAccessToRoom,
  query_getPrivateRooms,
  query_updateRoomName,
  query_deleteAccessToRoom,
} from "./database/queries";
import { executeQuery } from "./database/db";
import { mapRoomFromDB } from "./mapper";
import { RawRoom, Room } from "./types";

const getRooms = async (userId: string) => {
  const publicRooms = await executeQuery(query_getPublicRooms, []);
  const privateRooms = await executeQuery(query_getPrivateRooms, [
    parseInt(userId),
  ]);
  const rooms = [...publicRooms.rows, ...privateRooms.rows];
  const mappedRooms: Room[] = rooms.map((room: RawRoom) => {
    return mapRoomFromDB(room);
  });
  return mappedRooms;
};

const createPrivateRoom = async (userId: number, roomName: string) => {
  const newRoom = await executeQuery(query_createPrivateRoom, [
    roomName,
    true,
    userId,
  ]);
  await giveAccessToRoom(userId, newRoom.rows[0].id);
  const mappedRoom = mapRoomFromDB(newRoom.rows[0]);
  return mappedRoom;
};

const updatePrivateRoom = async (roomId: string, roomName: string) => {
  const updatedRoom = await executeQuery(query_updateRoomName, [
    parseInt(roomId),
    roomName,
  ]);
  const mappedRoom = mapRoomFromDB(updatedRoom.rows[0]);
  return mappedRoom;
};

const giveAccessToRoom = async (userId: number, roomId: number) => {
  await executeQuery(query_giveAccessToRoom, [userId, roomId]);
};

const deleteAccessToRoom = async (userId: number, roomId: number) => {
  await executeQuery(query_deleteAccessToRoom, [userId, roomId]);
};

export {
  getRooms,
  createPrivateRoom,
  updatePrivateRoom,
  giveAccessToRoom,
  deleteAccessToRoom,
};
