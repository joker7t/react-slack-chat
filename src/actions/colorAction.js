import { SET_COLORS } from "../reducers/type";

export const setColors = (primary, secondary) => dispatch => {
    dispatch({
        type: SET_COLORS,
        payload: {
            primary, secondary
        }
    });
};
