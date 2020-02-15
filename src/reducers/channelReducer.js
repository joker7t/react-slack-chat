import { GET_ALL_CHANNELS, ADD_CHANNEL, SET_CURRENT_CHANNEL } from "./type";

const initialState = {
    slectedChannel: {},
    channels: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_CHANNELS:
            return {
                ...state,
                channels: action.payload
            };
        case ADD_CHANNEL:
            return {
                ...state,
                channels: [...state.channels, action.payload]
            };
        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                slectedChannel: action.payload
            };
        default:
            return state;
    }
}