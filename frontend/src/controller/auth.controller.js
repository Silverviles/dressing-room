import { GoogleAuthProvider, signInWithPopup , signOut} from "firebase/auth";
import { auth } from "../utils/firebase";
import {loginUser, logoutUser} from "../utils/redux/user.slice";

const LoginWithGoogle = async (dispatch) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    const token = await user.getIdToken();

    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const isExpired = Date.now() >= exp * 1000;
    if (isExpired) {
      return
    }

    // save token and user info in persistent storage
    dispatch(loginUser({ user, token }));

    console.log("User successfully logged in.");

  } catch (error) {
    console.error("Login failed: ", error.message);
  }
};

const LogoutUser = async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(logoutUser());

    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Logout failed: ", error.message);
  }
};

export {LoginWithGoogle, LogoutUser}