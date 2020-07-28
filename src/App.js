import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HOME_PATH, LOGIN_PATH, REGISTER_PATH } from './utils/Constant';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import store from './store';
import { Provider } from 'react-redux';
import { SET_USER } from "./reducers/type";
import Spinner from "./components/spinner/Spinner";
import firebase from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(signedInUser => {
      store.dispatch({
        type: SET_USER,
        payload: {
          user: signedInUser,
          isLoading: false
        }
      });
      this.setState({ isLoading: false });
    });
  };

  render() {
    return this.state.isLoading ? <Spinner /> : (
      <Provider store={store}>
        <Router>
          <div className="app">
            <Route exact path={HOME_PATH} component={Landing} />
            <Route exact path={LOGIN_PATH} component={Login} />
            <Route exact path={REGISTER_PATH} component={Register} />
          </div>
        </Router>
      </Provider>
    );

  }
}

export default App;
