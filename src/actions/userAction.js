import { SET_USER } from "../reducers/type";

export const signIn = (user) => dispatch => {
    localStorage.setItem("user", user);
    dispatch({
        type: SET_USER,
        payload: {
            user: user,
            isLoading: false
        }
    });
};
