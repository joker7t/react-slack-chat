import { combineReducers } from "redux";
import userReducer from './userReducer';
import channelReducer from "./channelReducer";
import messageReducer from "./messageReducer";
import topPostReducer from "./topPostReducer";
import colorReducer from "./colorReducer";

export default combineReducers({
    user: userReducer,
    channel: channelReducer,
    message: messageReducer,
    topPost: topPostReducer,
    color: colorReducer
});