import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'

export const BACKEND = process.env.REACT_APP_BACKEND || 'INSERT BACKEND URL HERE';

const compName = 'App_LS';

export const PATHS = {
  root: "/",
  // TODO: include more paths here
}

export default class App extends Component {
  constructor(){
    super();
    this.state = {
    };
    this.componentCleanup = this.componentCleanup.bind(this);
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

  render() {
    return (
      <div>
        This is the index page... Time to get to work!
      </div>
    )
  }
}
