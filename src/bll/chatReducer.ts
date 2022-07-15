type InitialStateType = typeof initialState;

const initialState = {
  messages: [],
};

export const chatReducer = (state = initialState, action: any): InitialStateType => {
  switch (action.type) {
    case "ACTION":
      return {...state};
    default:
      return state;
  }
};
