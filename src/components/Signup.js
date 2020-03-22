import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Icon, Message, Grid, Dropdown } from 'semantic-ui-react';
import { PATHS } from "../App"
import { Redirect, Link } from "react-router-dom"
import swal from "sweetalert";
import { makeCall } from "../apis";

const compName = 'SignUp_LS';

let fieldStyle = {
    width: '100%',
}
let messageStyle = {
    padding: '20px',
    margin: '10px',
}

const gradeOptions = ['9th', '10th', '11th', '12th'].map(val => {
    return {key: val, text: val, value: val}
});

/*
props
-isStaff: boolean
*/
export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            grade: '',
            signUpDone: false,
            submitting: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.validateSubmitReadiness = this.validateSubmitReadiness.bind(this);
    }

    componentCleanup() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
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
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleChangeGrade(e, {value}) {
        e.preventDefault();
        this.setState({
            grade: value
        });
    }

    validateSubmitReadiness() {
        const baseCondition = (this.state.name && this.state.email && this.state.password && this.state.confirmPassword) && (this.state.confirmPassword === this.state.password);
        if (this.props.isStaff) {
            return baseCondition;
        }
        return baseCondition && this.state.grade;
    }
    handleSubmit(e) {
        e.preventDefault();
        const readyForSubmit = this.validateSubmitReadiness()
        this.setState({
            submitting: readyForSubmit,
        })
        if (readyForSubmit) {
            let payload = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }
            if (this.props.isStaff) {
                payload = Object.assign({}, payload, {
                    grade: this.state.grade
                });
            }
            e.preventDefault();
            const endPoint = this.props.isStaff ? '/staff/add' : '/student/add';
            makeCall(payload, endPoint, 'post').then(result => {
                if (!result || result.error) {
                    swal({
                        title: "Error!",
                        text: "There was an error completing your request, please try again.",
                        icon: "error",
                      });
                } else {
                    swal({
                        title: "Congratulations!",
                        text: "Your submission was successful! Please check your email to confirm your account.",
                        icon: "success",
                      });
                    this.setState({
                        signUpDone: true
                    })
                }
            });
        } else {
            swal({
                title: "Yikes!",
                text: "Please fill in all fields to continue. Confirm that passwords match!",
                icon: "error",
            });
        }
        
    }
    render() {
    return (
        <div>
            {this.state.signUpDone? <Redirect to="/" /> :
            <div>
                <Message
                    style= {messageStyle}
                    attached
                    centered
                    header={`${this.props.isStaff? "Staff" : "Student"} Sign up`}
                    content="Welcome! We're excited to have you on board."
                />
                <Grid>
                <Grid.Row centered>
                    <Button>
                        <Link to={PATHS.root}>
                            Back
                        </Link>
                    </Button>
                </Grid.Row>
                <Grid.Row centered>
                <Form onSubmit={this.handleSubmit}>
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
                    <Form.Field
                        type="password"
                        required="true"
                        style={fieldStyle}
                    >
                        <label>Confirm Password</label>
                        <input placeholder='***' name="confirmPassword" type="password" onChange={this.handleChange} />
                    </Form.Field>
                    {this.state.password !== this.state.confirmPassword ? 
                    <Message
                        attached
                        centered
                        error
                        content="Your passwords do not match!"
                    /> 
                    : null}
                    <Form.Field
                        type="text"
                        required="true"
                        style={fieldStyle}
                    >
                        <label>Name</label>
                        <input placeholder='Name' name="name" onChange={this.handleChange} />
                    </Form.Field>
                    {this.props.isStaff ? null :
                    <Form.Field>
                        <label>Grade</label>
                        <Dropdown placeholder='Select the grade you attend...' fluid selection options={gradeOptions} onChange={this.handleChangeGrade} name="grade" value={this.state.grade}/>
                    </Form.Field>
                    }
                    <Button 
                        color="blue" 
                        type='submit'
                        loading={this.state.submitting}>
                        <Icon name="unlock"/>
                        Submit
                    </Button>
                    </Form>
                </Grid.Row>
                </Grid>    
            </div>
            }
        </div>
        )
    }
}