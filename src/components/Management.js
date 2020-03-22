import React from 'react'
import { Grid, Message, Card, Form, Button, TextArea, Icon, Checkbox } from 'semantic-ui-react'
import { makeCall } from '../apis';
import swal from "sweetalert";

export default class Messaging extends React.Component {
    constructor() {
        super();
        this.state = {
            emailString: '',
            pendingStudents: [],
            sendingInvite: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleInvite(e) {
        e.preventDefault();
        // TODO: parse emails and make API call to send emails
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
                    <Form>
                        <Grid.Row>
                            <Message
                                style={{'margin': "20px 0 10px 0"}}
                                content={`Invite students to system. Enter all emails to invite as a comma-separated list.`}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <TextArea 
                                    disabled={this.state.sendingInvite}
                                    style={{'margin': '10px 0 10px 0'}}
                                    placeholder='student1@gmail.com, student2@yahoo.com, ...'
                                    name="emailString"
                                    value={this.state.emailString}
                                    onChange={this.handleChange}
                                />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Button
                                    onClick={this.handleInvite}
                                    loading={this.state.sendingInvite}
                                    disabled={!this.state.emailString || this.state.sendingInvite}
                                >
                                    <Icon name="paper plane"/>
                                    Invite
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Message
                                style={{'margin': "20px 0 10px 0"}}
                                content={`There are pending requests`}
                            />
                        </Grid.Row>
                        <Grid.Row
                            style={{'margin': '10px 0 10px 0'}}
                        >
                            List of pending requests
                        </Grid.Row>
                    </Form>
                </Grid>
            </Card>
        )
    }
    
}