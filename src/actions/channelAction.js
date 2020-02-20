import { SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL, SET_PRIVATE_CHANNEL } from "../reducers/type";

export const setCurrentChannel = (channel) => dispatch => {
    dispatch({
        type: SET_CURRENT_CHANNEL,
        payload: channel
    });
};

export const setPrivateChannel = (isPrivateChannel) => dispatch => {
    dispatch({
        type: SET_PRIVATE_CHANNEL,
        payload: isPrivateChannel
    });
};

export const setIsLoadingChannel = (isLoading) => dispatch => {
    dispatch({
        type: IS_LOADING_CHANNEL,
        payload: isLoading
    });
};
