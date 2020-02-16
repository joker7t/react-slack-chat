import { SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL } from "../reducers/type";

export const setCurrentChannel = (channel) => dispatch => {
    dispatch({
        type: SET_CURRENT_CHANNEL,
        payload: channel
    });
};

export const setIsLoadingChannel = (isLoading) => dispatch => {
    dispatch({
        type: IS_LOADING_CHANNEL,
        payload: isLoading
    });
};
