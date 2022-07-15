import {combineReducers, legacy_createStore as createStore} from "redux";
import {chatReducer} from "./chatReducer";

const rootReducer = combineReducers({
  chat: chatReducer,
});

export const store = createStore(rootReducer);
