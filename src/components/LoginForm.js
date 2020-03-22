import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { BACKEND, SCHOOL_NAME } from "../App";

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

let buttonStyle = {
    width: '80%',
}

const compName = 'LoginForm_LS';

/*
props:
-login: ()
-liftPayload: ()
*/
export default class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            incorrectCredentials: false,
            error: null,
            studentLoginLoading: false,
            staffLoginLoading: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitAsStudent = this.handleSubmitAsStudent.bind(this);
        this.handleSubmitAsStaff = this.handleSubmitAsStaff.bind(this);
        this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    // TODO: Combine both login handler functions into one with a bool flag for isStaff
    handleSubmitAsStaff(e) {
        e.preventDefault();
        this.setState({staffLoginLoading: true});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/login`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            // TODO: revise as per response from APIs
            let resolvedRes = await res;
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedRes.error ? resolvedRes.error : `Your login was unsuccessful.`,
                    staffLoginLoading: false,
                });
            }
            else {
                resolvedRes = await resolvedRes.json()
                this.setState({
                    incorrectCredentials: false,
                    staffLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedRes, true);
                })
            }
        });
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

    handleSubmitAsStudent(e) {
        e.preventDefault();
        this.setState({studentLoginLoading: true});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        fetch(`${BACKEND}/login`, {
            method: 'post',
            credentials: 'include',
            headers: headers,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).then(async res => {
            let resolvedRes = await res;
            if (resolvedRes.status === 400) {
                this.setState({
                    incorrectCredentials: true,
                    error: resolvedRes.error ? resolvedRes.error : `Your login was unsuccessful.`,
                    studentLoginLoading: false,
                })
            }
            else {
                resolvedRes = await resolvedRes.json()
                this.setState({
                    incorrectCredentials: false,
                    studentLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(resolvedRes, false);
                })
            }
        });        
    }
    
    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    renderIncorrectCredentialsMessage() {
    let messageStyle = {
        width: '80%',
        margin: '10px'
    }
    return this.state.incorrectCredentials ?
    <Grid centered>
        <Message
        error
        content={this.state.error}
        style = {messageStyle}
    />
    </Grid>
    : null
    }
    render() {
        return (
            <div>
                <Message
                    style= {messageStyle}
                    attached
                    centered
                    header={`Welcome to ${SCHOOL_NAME}'s Portal`}
                    content='Please sign in.'
                />
                {this.renderIncorrectCredentialsMessage()}
                <Grid>
                    <Grid.Row centered>
                    <Form >
                        <Form.Field
                        type="email"
                        required="true"
                        style={fieldStyle}
                        >
                            <label>Email</label>
                            <input placeholder='Email' name="email" onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field
                            type="password"
                            required="true"
                            style={fieldStyle}
                        >
                            <label>Password</label>
                            <input placeholder='***' name="password" type="password" onChange={this.handleChange} />
                        </Form.Field>
                    </Form>
                    </Grid.Row>
                    <Grid.Row centered columns={2}>
                        <Grid.Column>
                            <Button
                                style={buttonStyle}
                                onClick={this.handleSubmitAsStudent}
                                loading={this.state.studentLoginLoading}
                            >
                                <Icon name="unlock"/>
                                Login as Student
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                style={buttonStyle}                        
                                onClick={this.handleSubmitAsStaff}
                                loading={this.state.staffLoginLoading}
                            >
                                <Icon name="unlock"/>
                                Login as Staff
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>     
            </div>
        )
    }
}