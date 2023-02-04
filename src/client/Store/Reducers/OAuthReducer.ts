import { AUTH } from '../actionTypes';

const authReducer = (state: any = { authData: null }, action: any) => {
  switch (action.type) {
    case AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };

    default:
      return state;
  }
};

export default authReducer;
