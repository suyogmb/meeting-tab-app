import {APP_ACTIONS_TYPES, USER_ACTION_TYPES} from './actions';

const initialAppState = {
  isLogin: false,
};

const initialUserState = {userProfile: null};

interface AppReducerType {
  type: string;
  payload?: {isLogin: boolean};
}

interface UserReducerType {
  type: string;
  payload?: {userProfile: object};
}

const appReducer = (state = initialAppState, action: AppReducerType) => {
  switch (action.type) {
    case APP_ACTIONS_TYPES.IS_LOGIN:
      return Object.assign({}, state, {
        isLogin: action.payload,
      });

    default:
      return {...state};
  }
};

const userReducer = (state = initialUserState, action: UserReducerType) => {
  switch (action.type) {
    case USER_ACTION_TYPES.USER_PROFILE:
      return Object.assign({}, state, {
        userProfile: action.payload,
      });
    case USER_ACTION_TYPES.RESET_PROFILE:
      return {...initialUserState};

    default:
      return {...state};
  }
};

export {appReducer, userReducer};
