import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HOME_PATH, LOGIN_PATH, REGISTER_PATH } from './utils/Constant';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import 'semantic-ui-css/semantic.min.css';
import store from './store';
import { Provider } from 'react-redux';
import { SET_USER } from "./reducers/type";

const user = localStorage.user;
if (user) {
  store.dispatch({
    type: SET_USER,
    payload: {
      user: user,
      isLoading: false
    }
  });
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
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
