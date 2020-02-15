import { combineReducers } from "redux";
import userReducer from './userReducer';
import channelReducer from "./channelReducer"

export default combineReducers({
    users: userReducer,
    channels: channelReducer
});