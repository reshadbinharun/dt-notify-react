import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import Header from './components/Header';


import { simpleAction } from './actions/simpleAction'

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
})

export const BACKEND = process.env.REACT_APP_BACKEND || 'INSERT BACKEND URL HERE';

const compName = 'App_LS';

export const PATHS = {
  root: "/",
  login: "login"
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: true
    };
    this.componentCleanup = this.componentCleanup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentCleanup() {
    sessionStorage.setItem(compName, JSON.stringify(this.state));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.componentCleanup);
    const persistState = sessionStorage.getItem(compName);
    if (persistState) {
      try {
        this.setState(JSON.parse(persistState));
      } catch (e) {
        console.log("Could not get fetch state from local storage for", compName);
      }
    }
  }

  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup);
  }

  login() {
    //TODO: should redirect to index path
    //TODO: clear cookie
    this.setState({
      loggedIn: true
    });
  }

  logout() {
    this.setState({
      loggedIn: false
    });
  }

  render() {
    return (
      <div>
        <Header
          loggedIn={this.state.loggedIn}
          logout={this.logout}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
