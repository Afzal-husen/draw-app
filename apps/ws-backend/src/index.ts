import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";
import { prisma } from "@repo/db";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return;
  const searchParams = new URLSearchParams(url.split("?")[1]);
  const token = searchParams.get("token") ?? "";
  const userId = checkUser(token);
  if (userId === null) {
    socket.close();
    return;
  }

  users.push({
    ws: socket,
    rooms: [],
    userId,
  });

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
    const user = users.find((user) => user.ws === socket);

    if (!user) return;

    if (parsedMessage.type === "join_room") {
      user.rooms.push(parsedMessage.roomId);
    }

    if (parsedMessage.type === "leave_room") {
      user.rooms = user.rooms.filter(
        (roomId) => roomId !== parsedMessage.roomId,
      );
    }

    if (parsedMessage.type === "chat") {
      const message = parsedMessage.message;
      const roomId = parsedMessage.roomId;

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            }),
          );
        }
      });
    }
  });
});
