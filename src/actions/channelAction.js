import { SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL, SET_PRIVATE_CHANNEL, SET_STARRED_CHANNEL } from "../reducers/type";

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

export const setStarredChannel = (starredChannels) => dispatch => {
    dispatch({
        type: SET_STARRED_CHANNEL,
        payload: starredChannels
    });
};
