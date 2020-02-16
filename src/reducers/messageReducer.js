// import { GET_ALL_MESSAGES } from "./type";

const initialState = {
    selectedMessage: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        // case GET_ALL_MESSAGES:
        //     return {
        //         ...state,
        //         messages: action.payload
        //     };
        default:
            return state;
    }
}