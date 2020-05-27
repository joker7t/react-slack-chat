import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootProducer from "./reducers";

const initialState = {};
const middleware = [thunk];

let store;

const reactRedux = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

if (window.navigator.userAgent.includes("Chrome") && reactRedux) {
    store = createStore(
        rootProducer,
        initialState,
        compose(applyMiddleware(...middleware),
            reactRedux)
    );
} else {
    store = createStore(
        rootProducer,
        initialState,
        compose(applyMiddleware(...middleware))
    );
}

export default store;