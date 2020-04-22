import React, { Component } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'
import swal from 'sweetalert';
import { BACKEND } from "../apis";

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

let buttonStyle = {
    width: '100px',
}

/*
    courseId
*/
export default class NewAssignmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentName: '',
            dueDate: null,
            file: null,
            submitting: false
        }
        this.selectFile = this.selectFile.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.submitAssignment = this.submitAssignment.bind(this);
    }

    handleDateChange(date) {
        this.setState({
            dueDate: date
        });
    }

    selectFile(e) {
        e.preventDefault();
        this.setState({
            file: e.target.files[0]
        })
    }

    handleNameChange(e) {
        e.preventDefault();
        this.setState({
            assignmentName: e.target.value
        })
    }

    submitAssignment(e) {
        // TODO: test this API
        this.setState({
            submitting: true
        }, () => {
            let data = new FormData();
            data.append('file', this.state.file);
            data.append('assignmentName', this.state.assignmentName);
            data.append('dueDate', this.state.dueDate);
            data.append('courseId', this.props.courseId);
            fetch(`${BACKEND}/assignment`, {
            method: 'POST',
            headers: {
              "Content-Type": "multipart/form-data"
            },
            body: data
          }).then(
            response => response.json()
          ).then(
            success => {
                swal({
                    title: "Success!",
                    text: `You have successfully posted the assignment!`,
                    icon: "success",
                }, () => {
                    this.setState({submitting: false})
                    this.props.close();
                })
            }
          ).catch(
            error => {
                this.setState({submitting: false})
                console.log(error) 
            }
          );
        })
    }

    render() {
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>
                    Post a new assignment
                </Modal.Header>
                <Modal.Content>
                    <Form disabled={this.state.submitting}>
                        <Form.Field>
                            <input placeholder='Assignment Name...' name="assignmentName" onChange={this.handleNameChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>
                                When is the assignment due?
                            </label>
                            <DatePicker
                                selected={this.state.dueDate}
                                onChange={this.handleDateChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Upload a .pdf of the assignment</label>
                            <input type="file" onChange={this.selectFile} class="ui huge brown center floated button"/>
                        </Form.Field>
                        <Button
                            basic
                            color="brown"
                            onClick={this.submitAssignment}
                            loading={this.state.submitting}
                            disabled={this.state.submitting}
                        >
                            Post Assignment!
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
