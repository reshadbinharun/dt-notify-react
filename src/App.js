import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import { Route, BrowserRouter as Router, Link, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import StaffView from './components/StaffView';


import { simpleAction } from './actions/simpleAction'

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
})

export const BACKEND = process.env.REACT_APP_BACKEND || 'INSERT BACKEND URL HERE';
export const SCHOOL_NAME = process.env.REACT_APP_SCHOOL || 'Dhanmondi Tutorial';

const compName = 'App_LS';

export const PATHS = {
  root: "/",
  studentSignUp: "/student/signUp",
  staffSignUp: "/staff/signUp"
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      isStaff: false,
      staffDetails: {},
      // TODO: add state to hold student details if needed
    };
    this.componentCleanup = this.componentCleanup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
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

  liftPayload(details, isStaff) {
    if (isStaff) {
      this.setState({
        isStaff: true,
        staffDetails: details
      });
    }
    // TODO: Add student details to state/store if needed
  }

  renderLogin() {
    let loggedInView =
      this.state.isStaff ? 
        <StaffView
          payload = {this.state.mentorPayload}
        /> : null
        // TODO: add StudentView if needed
    let navigation =
    <Grid centered>
      <Router>
        <div>
          <Switch>
            <Route exact path={PATHS.root} render={(props) => 
              <div>
                <div>
                  <Grid centered rows={1}>
                    <Grid.Row left>
                      <Button
                      >
                        <Link to={PATHS.studentSignUp}>
                          Sign up as Student
                        </Link>
                      </Button>
                      <Button
                      >
                        <Link to={PATHS.staffSignUp}>
                          Sign up as Staff
                        </Link>
                      </Button>
                    </Grid.Row>
                  </Grid>
                </div>
                <Divider/>
                <LoginForm
                  login = {this.login}
                  liftPayload = {this.liftPayload}
                />
              </div>
            }/>
            <Route exact path={PATHS.studentSignUp} render={() => 
              <div>TODO: Add Student Sign Up Form here</div>
              }
            />
            <Route exact path={PATHS.staffSignUp} render={() => 
              <div>TODO: Add Staff Sign Up Form here</div>
              }
            />
          </Switch>
        </div>
      </Router>
    </Grid>
    return this.state.loggedIn ? loggedInView : navigation;
  }

  render() {
    return (
      <div>
        <Header
          loggedIn={this.state.loggedIn}
          logout={this.logout}
        />
        <Container>
          {this.renderLogin()}
        </Container>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
