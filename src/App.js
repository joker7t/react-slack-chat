import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HOME_PATH, LOGIN_PATH, REGISTER_PATH } from './utils/Constant';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';
import createHistory from './history';
import store from './store';
import { Provider } from 'react-redux';

class App extends Component {
  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          createHistory.push(HOME_PATH);
        }
      })
  }

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
