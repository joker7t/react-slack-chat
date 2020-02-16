import { SET_CURRENT_CHANNEL, IS_LOADING_CHANNEL } from "./type";

const initialState = {
    selectedChannel: {},
    isLoadingChannel: true
};

export default function (state = initialState, action) {
    switch (action.type) {
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