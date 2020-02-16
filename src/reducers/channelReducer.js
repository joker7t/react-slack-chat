import { GET_ALL_CHANNELS, SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL } from "./type";

const initialState = {
    selectedChannel: {},
    channels: [],
    isLoadingChannel: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_CHANNELS:
            return {
                ...state,
                channels: action.payload
            };
        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                selectedChannel: action.payload
            };
        case IS_LOADING_CHANNEL:
            return {
                ...state,
                isLoadingChannel: action.payload
            };
        default:
            return state;
    }
}