import { SET_TOP_POSTER } from "./type";

const initialState = {
    topPosters: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TOP_POSTER:
            return {
                ...state,
                topPosters: action.payload
            };
        default:
            return state;
    }
}