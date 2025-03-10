import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return;
  const searchParams = new URLSearchParams(url.split("?")[1]);
  const token = searchParams.get("token") ?? "";
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded || !(decoded as JwtPayload).userId) {
    socket.close();
    return;
  }
  // allow to send message
});
