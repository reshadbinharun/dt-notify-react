import React from 'react'
import { Grid, Message, Card, Form, Button, TextArea, Icon, Table } from 'semantic-ui-react'
import { makeCall } from '../apis';
import swal from "sweetalert";

const compName = 'Management_LS';

/*
props:
- isStudentView: boolean
*/
export default class Messaging extends React.Component {
    constructor() {
        super();
        this.state = {
            emailString: '',
            // TODO: remove mock data later
            pendingStudents: [{email: 'ree@gmail.com', name: 'Ree', grade: '9th'},{email: 'ree@gmail.com', name: 'Ree 2', grade: '8th'}],
            pendingStaff: [{email: 'teacher@gmail.com', name: 'Teach Ree'},{email: 'teacher2@gmail.com', name: 'Ree 2'}],
            sendingRequest: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
        this.generateRequests = this.generateRequests.bind(this);
        this.handleApproval = this.handleApproval.bind(this);
        this.handleReject = this.handleReject.bind(this);
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

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    async handleInvite(e) {
        e.preventDefault();
        const emailsArr = this.state.emailString.replace(/\s/g, '').split(',');
        this.setState({sendingRequest: true});
        const payload = {
            emails: emailsArr
        };
        const endPoint = this.props.isStudentView ? '/invite/students' : '/invite/staff'
        try {
            const result = await makeCall(payload, endPoint, 'post')
            if (!result || result.error) {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Error!",
                        text: `There was an error inviting the ${this.props.isStudentView ? 'student' : 'staff'}, please try again.`,
                        icon: "error",
                    });
                });
            } else {
                this.setState({
                    sendingRequest: false,
                    emailString: ''
                }, () => {
                    swal({
                        title: "Success!",
                        text: `You've successfully invited all ${this.props.isStudentView ? 'students' : 'staff'}!`,
                        icon: "success",
                    });
                });
            }
        } catch (e) {
            console.log("Error: Management#handleInvite", e)
        }
    }

    async handleApproval(email) {
        this.setState({sendingRequest: true});
        const payload = {
            approved: true,
            email: email
        };
        const endPoint = this.props.isStudentView ? '/approve/student' : '/approve/staff'
        try {
            const result = await makeCall(payload, endPoint, 'post');
            if (!result || result.error) {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Error!",
                        text: `There was an error approving the ${this.props.isStudentView ? 'student' : 'staff'}, please try again.`,
                        icon: "error",
                    });
                });
            } else {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Success!",
                        text: `You've successfully approved the ${this.props.isStudentView ? 'students' : 'staff'}!`,
                        icon: "success",
                    });
                });
            }
        } catch (e) {
            console.log("Error: Management#handleApproval", e);
        }
    }

    async handleReject(email) {
        this.setState({sendingRequest: true});
        const payload = {
            email: email
        };
        const endPoint = this.props.isStudentView ? '/students/delete' : '/staff/delete'
        try {
            const result = await makeCall(payload, endPoint, 'post');
            if (!result || result.error) {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Error!",
                        text: `There was an error rejecting the ${this.props.isStudentView ? 'student' : 'staff'}, please try again.`,
                        icon: "error",
                    }).then(() => {
                        window.location.reload();
                    });
                });
            } else {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Success!",
                        text: `You've successfully rejected the ${this.props.isStudentView ? 'student' : 'staff'}!`,
                        icon: "success",
                    }).then(() => {
                        window.location.reload();
                    });
                });
            }
        } catch(e) {
            console.log("Error: Management#handleReject", e);
        }
    }

    generateRequests() {
        if (this.props.isStudentView) {
            const items = this.state.pendingStudents;
            const tableHeader = 
                <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Grade</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Approval</Table.HeaderCell>
                    <Table.HeaderCell>Rejection</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            
            const tableBody = 
                <Table.Body>
                    {items.map(member => {
                        return (
                        <Table.Row>
                            <Table.Cell>{member.name}</Table.Cell>
                            <Table.Cell>{member.grade}</Table.Cell>
                            <Table.Cell>{member.email}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    disabled={this.state.sendingRequest}
                                    style={{'height':'80%', 'margin': '2px 0 2px 0'}}
                                    onClick={() => this.handleApproval(member.email)}
                                >
                                    Approve
                                </Button>
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    disabled={this.state.sendingRequest}
                                    style={{'height':'80%', 'margin': '2px 0 2px 0'}}
                                    onClick={() => this.handleReject(member.email)}
                                >
                                    Reject
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        )
                    })}
                </Table.Body>
          return (
            <Table celled>
                {tableHeader}
                {tableBody}
                <Table.Footer style={{margin: '10px 0 10px 0'}}>
                    {/* TODO: Add pagination for when there are many records */}
                </Table.Footer>
            </Table> 
          )
        }
        const items = this.state.pendingStaff;
        const tableHeader = 
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Approval</Table.HeaderCell>
                <Table.HeaderCell>Rejection</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        
        const tableBody = 
            <Table.Body>
                {items.map(member => {
                    return (
                    <Table.Row>
                        <Table.Cell>{member.name}</Table.Cell>
                        <Table.Cell>{member.email}</Table.Cell>
                        <Table.Cell>
                            <Button
                                disabled={this.state.sendingRequest}
                                style={{'height':'80%', 'margin': '2px 0 2px 0'}}
                                onClick={() => this.handleApproval(member.email)}
                            >
                                Approve
                            </Button>
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                disabled={this.state.sendingRequest}
                                style={{'height':'80%', 'margin': '2px 0 2px 0'}}
                                onClick={() => this.handleReject(member.email)}
                            >
                                Reject
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    )
                })}
            </Table.Body>
        return (
        <Table celled>
            {tableHeader}
            {tableBody}
            <Table.Footer style={{margin: '10px 0 10px 0'}}>
                {/* TODO: Add pagination for when there are many records */}
            </Table.Footer>
        </Table>
        )
    }

    render() {
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid centered={true} rows={5}>
                    <Form style={{width: '80%'}}>
                        <Grid.Row>
                            <Message
                                style={{'margin': "20px 0 10px 0"}}
                                content={`Invite ${this.props.isStudentView ? 'student' : 'staff'} to system. Enter all emails to invite as a comma-separated list.`}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <TextArea 
                                    disabled={this.state.sendingRequest}
                                    style={{'margin': '10px 0 10px 0'}}
                                    placeholder='member1@gmail.com, member2@yahoo.com, ...'
                                    name="emailString"
                                    value={this.state.emailString}
                                    onChange={this.handleChange}
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Button
                                    onClick={this.handleInvite}
                                    loading={this.state.sendingRequest}
                                    disabled={!this.state.emailString || this.state.sendingRequest}
                                >
                                    <Icon name="paper plane"/>
                                    Invite
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Message
                                style={{'margin': "20px 0 10px 0"}}
                                content={
                                    (this.props.isStudentView ? 
                                        (this.state.pendingStudents && this.state.pendingStudents.length) : ((this.state.pendingStaff && this.state.pendingStaff.length))) ? 
                                            `There are pending requests` : `There are no pending requests.`}
                            />
                        </Grid.Row>
                        <Grid.Row
                            style={{'margin': '10px 0 10px 0'}}
                        >
                            {this.generateRequests()}
                        </Grid.Row>
                    </Form>
                </Grid>
            </Card>
        )
    }
    
}