import { SET_USER, CLEAR_USER } from "./type";

const initialState = {
    user: {},
    isLoading: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return action.payload;
        case CLEAR_USER:
            return action.payload;
        default:
            return state;
    }
}