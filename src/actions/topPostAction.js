import { SET_TOP_POSTER } from "../reducers/type";

export const setTopPosters = (topPosters) => dispatch => {
    dispatch({
        type: SET_TOP_POSTER,
        payload: topPosters
    });
};
