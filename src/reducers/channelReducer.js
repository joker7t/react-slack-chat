import { SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL, SET_PRIVATE_CHANNEL } from "./type";

const initialState = {
    selectedChannel: {},
    isPrivateChannel: false,
    isLoadingChannel: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                selectedChannel: action.payload,
                isPrivateChannel: false
            };
        case SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload
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