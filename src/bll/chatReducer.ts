import {AppThunkType} from "./store";
import {api, MessageType, UserType} from "../api/api";

type InitialStateType = typeof initialState;

const initialState = {
  messages: [] as Array<MessageType>,
  typingUsers: [] as Array<UserType>,
};

export const chatReducer = (state = initialState, action: ChatActionsType): InitialStateType => {
  switch (action.type) {
    case "MESSAGES-RECEIVED":
      return {...state, messages: action.messages};
    case "NEW-MESSAGE-RECEIVED":
      return {
        ...state,
        messages: [...state.messages, action.message],
        typingUsers: state.typingUsers.filter(u => u.id !== action.message.user.id),
      };
    case "ADD-TYPING-USER":
      return {
        ...state,
        typingUsers: [...state.typingUsers.filter(u => u.id !== action.user.id), action.user],
      };
    default:
      return state;
  }
};

export type ChatActionsType =
  | ReturnType<typeof messagesReceived>
  | ReturnType<typeof newMessagesReceived>
  | ReturnType<typeof addTypingUser>;

const messagesReceived = (messages: Array<MessageType>) =>
  ({type: "MESSAGES-RECEIVED", messages} as const);
const newMessagesReceived = (message: MessageType) =>
  ({type: "NEW-MESSAGE-RECEIVED", message} as const);
const addTypingUser = (user: UserType) =>
  ({type: "ADD-TYPING-USER", user} as const);

export const createSocketConnection = (): AppThunkType => (dispatch) => {
  api.createConnection();
  api.subscribe(
    (messages, fn) => {
      dispatch(messagesReceived(messages));
      fn("Front-end data");
    }, (message) => {
      dispatch(newMessagesReceived(message));
    },
    (user) => {
      dispatch(addTypingUser(user));
    }
  );
};
export const sendUserName = (name: string): AppThunkType => () => {
  api.sendName(name);
};
export const sendMessage = (message: string): AppThunkType => () => {
  api.sendMessage(message);
};
export const destroySocketConnection = (): AppThunkType => () => {
  api.destroyConnection();
};
export const typeMessage = () => () => {
  api.typeMessage();
};
