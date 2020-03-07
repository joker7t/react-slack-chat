import { SET_COLORS } from "./type";

const initialState = {
    primary: '#4c3c4c',
    secondary: '#eee'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_COLORS:
            return {
                ...state,
                primary: action.payload.primary,
                secondary: action.payload.secondary
            };
        default:
            return state;
    }
}