import { GET_ALL_CHANNELS, SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL } from "../reducers/type";

export const getAllChannels = (channels) => dispatch => {
    dispatch({
        type: GET_ALL_CHANNELS,
        payload: channels
    });
};

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
