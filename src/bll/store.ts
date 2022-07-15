import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {ChatActionsType, chatReducer} from "./chatReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
  chat: chatReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

type RootActionsType = ChatActionsType;
export type AppStateType = ReturnType<typeof store.getState>;
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, RootActionsType>;
export type AppDispatchType = ThunkDispatch<AppStateType, unknown, RootActionsType>;

export const useAppDispatch = () => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector;