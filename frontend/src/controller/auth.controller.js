import { api } from "../api/client";
import { loginUser, logoutUser } from "../utils/redux/user.slice";

export const registerWithPassword = async (dispatch, username, password) => {
  const response = await api.register(username, password);
  dispatch(loginUser(response));
  return response;
};

export const loginWithPassword = async (dispatch, username, password) => {
  const response = await api.login(username, password);
  dispatch(loginUser(response));
  return response;
};

export const logoutCurrentUser = (dispatch) => {
  dispatch(logoutUser());
};
