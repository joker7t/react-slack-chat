import { GET_ALL_CHANNELS, ADD_CHANNEL } from "../reducers/type";

export const geAllChannels = (channels) => dispatch => {
    dispatch({
        type: GET_ALL_CHANNELS,
        payload: channels
    });
};

export const addChannel = (channel) => dispatch => {
    dispatch({
        type: ADD_CHANNEL,
        payload: channel
    });
};
