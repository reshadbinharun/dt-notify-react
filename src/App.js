import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Segment } from 'semantic-ui-react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import StaffView from './components/StaffView';
import Register from './screens/Register';

export const SCHOOL_NAME = process.env.REACT_APP_SCHOOL || 'Dhanmondi Tutorial';

const compName = 'App_LS';

export const PATHS = {
  root: "/", // nested -> /staff/tracking, /staff/manage, /student/tracking, /student/manage
  login: "/login",
  register: "/register", // nested -> /student, /staff
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: true,
      isStaff: true,
      staffDetails: {},
    };
    this.componentCleanup = this.componentCleanup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.renderScreens = this.renderScreens.bind(this);
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
    // TODO: Make API call to login
    this.setState({
      loggedIn: true
    });
  }

  logout() {
    // TODO: make API call to clear cookie
    this.setState({
      loggedIn: false
    });
  }

  liftPayload(details, isStaff) {
    if (isStaff) {
      this.setState({
        isStaff: true,
        staffDetails: details
      });
    }
  }

  renderScreens() {
    return (
        <Switch>
          <Route exact path={PATHS.register} render={(props) => 
              <Register match={props.match}/>
            }
          />
          <Route exact path={PATHS.login} render={(props) => 
              <LoginForm
                liftPayload={this.liftPayload}
              />
            }
          />
          <Route exact path={PATHS.root} render={(props) => 
              this.state.loggedIn ? <StaffView/> : <LoginForm
                liftPayload={this.liftPayload}
              />
            }
          />
          <Route>
              <Segment>
                  This page does not exist!
              </Segment>
          </Route>
        </Switch>
    )
  }

  render() {
    return (
      <div>
        <Router>
          <Header
            loggedIn={this.state.loggedIn}
            logout={this.logout}
            email={this.state.staffDetails && this.state.staffDetails.email}
          />
          <Container>
            {this.renderScreens()}
          </Container>
        </Router>
      </div>
    )
  }
}
