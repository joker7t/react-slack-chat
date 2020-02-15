import { GET_ALL_CHANNELS, SET_CURRENT_CHANNEL } from "./type";

const initialState = {
    selectedChannel: {},
    channels: []
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
        default:
            return state;
    }
}