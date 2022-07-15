import {io, Socket} from "socket.io-client";

export type UserType = {
  id: string
  name: string
};
export type MessageType = {
  id: string
  message: string
  user: UserType
};

export const api = {
  socket: null as null | Socket,
  createConnection() {
    this.socket = io("http://localhost:3009/");
  },
  subscribe(
    initMessagesHandler: (messages: Array<MessageType>, fn: (data: string) => void) => void,
    newMessageHandler: (message: MessageType) => void,
    userTypingHandler: (user: UserType) => void,
  ) {
    this.socket?.on("init-messages-published", initMessagesHandler);
    this.socket?.on("new-message-sent", newMessageHandler);
    this.socket?.on("user-typing", userTypingHandler);
  },
  sendName(name: string) {
    this.socket?.emit("client-userName-sent", name);
  },
  sendMessage(message: string) {
    this.socket?.emit("client-message-sent", message, (error: string | null) => {
      if(error) alert(error);
    });
  },
  typeMessage() {
    this.socket?.emit("client-typing-message");
  },
  destroyConnection() {
    this.socket?.disconnect();
    this.socket = null;
  },
};
