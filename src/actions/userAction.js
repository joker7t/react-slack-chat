import { SET_USER, CLEAR_USER } from "../reducers/type";

export const signIn = (user) => dispatch => {
    dispatch({
        type: SET_USER,
        payload: {
            user: user,
            isLoading: false
        }
    });
};

export const signOut = () => dispatch => {
    dispatch({
        type: CLEAR_USER,
        payload: {
            user: {},
            isLoading: true
        }
    });
};

