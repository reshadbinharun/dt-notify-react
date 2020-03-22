import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid } from 'semantic-ui-react';
import { SCHOOL_NAME } from "../App";
import { makeCall } from "../apis";

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
        this.handleSubmitAsStaff = this.handleSubmitAsStaff.bind(this);
        this.handleSubmitAsStudent = this.handleSubmitAsStudent.bind(this);
        this.renderIncorrectCredentialsMessage = this.renderIncorrectCredentialsMessage.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    handleSubmitAsStudent(e) {
        e.preventDefault()
        this.setState({studentLoginLoading: true});
        const payload = {
            email: this.state.email,
            password: this.state.password
        };
        makeCall(payload, '/login', 'post').then(result => {
            if (result.error) {
                this.setState({
                    incorrectCredentials: true,
                    error: result.error ? result.error : `Your login was unsuccessful.`,
                    studentLoginLoading: false
                });
            } else {
                this.setState({
                    incorrectCredentials: false,
                    studentLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(result, true);
                });
            }
        });
    }

    handleSubmitAsStaff(e) {
        e.preventDefault()
        this.setState({staffLoginLoading: true});
        const payload = {
            email: this.state.email,
            password: this.state.password
        };
        makeCall(payload, '/login', 'post').then(result => {
            if (result.error) {
                this.setState({
                    incorrectCredentials: true,
                    error: result.error ? result.error : `Your login was unsuccessful.`,
                    staffLoginLoading: false
                }); 
            } else {
                this.setState({
                    incorrectCredentials: false,
                    staffLoginLoading: false,
                },() => {
                    this.props.login()
                    this.props.liftPayload(result, true);
                });
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