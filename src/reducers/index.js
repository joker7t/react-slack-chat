import { combineReducers } from "redux";
import userReducer from './userReducer';
import channelReducer from "./channelReducer";
import messageReducer from "./messageReducer";

export default combineReducers({
    user: userReducer,
    channel: channelReducer,
    message: messageReducer
});