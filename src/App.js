import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Segment, Message } from 'semantic-ui-react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import StaffView from './components/StaffView';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import Register from './screens/Register';
import { makeCall } from "./apis";

export const SCHOOL_NAME = process.env.REACT_APP_SCHOOL || 'Dhanmondi Tutorial';

export const PATHS = {
  root: "/",
  login: "/login",
  register: "/register",
}

export default class App extends Component {
  constructor() {
    super();
    // TODO: change isStaff to a role string
    this.state = {
      loggedIn: false,
      fetchingAuth: true,
      isStaff: true,
      userDetails: {},
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.liftPayload = this.liftPayload.bind(this);
    this.renderScreens = this.renderScreens.bind(this);
    this.userView = this.userView.bind(this);
  }

  componentDidMount() {
    this.setState({
      fetchingAuth: true
    }, async () => {
      try {
        const result = await makeCall({}, '/isLoggedIn', 'get')
        if (!result || result.error) {
            this.setState({
                fetchingAuth: false
            });
        } else {
            this.setState({
                fetchingAuth: false,
                loggedIn: true
            });
        }
      } catch (e) {
          this.setState({
            fetchingAuth: false,
          });
          console.log("Error: App#componentDidMount", e)
      }
    })
  }

  login() {
    this.setState({
      loggedIn: true
    });
  }

  async logout() {
    await makeCall({}, '/logout', 'get');
    this.setState({
      loggedIn: false
    });
  }

  userView(role) {
    switch (role.toUpperCase()) {
      case 'STUDENT':
        return <StudentView 
          isLoggedIn={this.state.loggedIn}
        />
      case 'STAFF':
        return <StaffView 
          isLoggedIn={this.state.loggedIn}
        />
      case 'TEACHER':
        return <TeacherView
          isLoggedIn={this.state.loggedIn}
        />
      default:
        return null
    }
  }

  liftPayload(details, isStaff) {
    if (isStaff) {
      this.setState({
        isStaff: true,
        userDetails: details
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
                isLoggedIn={this.state.loggedIn}
                liftPayload={this.liftPayload}
                login={this.login}
              />
            }
          />
          <Route exact path={PATHS.root} render={(props) => 
              // TODO: uncomment this and do not hardcode role
              // this.userView(this.state.userDetails && this.state.userDetails.role) :
              this.userView("STAFF")
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
        <Router>
          {this.state.fetchingAuth ? 
            <>
              <Message
                style={{
                  width: '100%',
                  height: '100%',
                }}
                header={"Fetching Authorization, please wait..."}
              />
              
              <Segment
                style={{
                  width: '100%',
                  height: '300px',
                }}
                loading={true}
              >
              </Segment>
            </> :
            <>
            <Header
              loggedIn={this.state.loggedIn}
              logout={this.logout}
              email={this.state.userDetails && this.state.userDetails.email}
            />
            <Container>
              {this.renderScreens()}
            </Container>
            </>
          }
        </Router>
    )
  }
}
