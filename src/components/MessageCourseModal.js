import React, { Component } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'
import { makeCall } from "../apis";
import swal from "sweetalert"

const MAX_CHARS_MESSAGE = 1000;

export default class MessageCourseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            sendingRequest: false
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    sendMessage(e) {
        e.preventDefault();
        this.setState({
            sendingRequest: true
        }, async () => {
            const message = this.state.message;
            const courseId = this.props.courseId
            try {
                const result = await makeCall({message, courseId}, '/course/sendMessage', 'post');
                this.setState({
                    sendingRequest: false,
                    message: '',
                });
                if (!result || result.error) {
                    swal({
                        title: "Error!",
                        text: `There was an error messaging the class, please try again.`,
                        icon: "error",
                    });
                } else {
                    swal({
                        title: "Success!",
                        text: `You have successfully messaged the class.`,
                        icon: "success",
                    }).then(() => {
                        this.props.close();
                    })
                }
            } catch (e) {
                console.log("Error: MessageCourseModal#sendMessage", e);
            }
        })
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    render() {
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>Messaging your class for {this.props.courseName}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.sendMessage}>
                    <Form.Field
                        type="text">
                            <label>Message</label>
                            <input maxlength={MAX_CHARS_MESSAGE} placeholder='Your message...' name="message" onChange={this.handleChange} value={this.state.message} />
                        </Form.Field>
                        <Button 
                            color="blue" 
                            type='submit'
                            loading={this.state.sendingRequest}
                            disabled={!this.state.message || this.state.sendingRequest}
                        >
                            Send
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.close}>
                        Done
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
