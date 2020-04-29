import React, { Component } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'
import swal from 'sweetalert';
import { BACKEND } from "../apis";
import axios from "axios";

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
/*
    courseId
    courseName
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
        // TODO: BROKEN: FIX ME BITCH
        this.setState({
            submitting: true
        }, () => {
        let data = new FormData();
        data.append('file', this.state.file);
        data.set('name', this.state.assignmentName);
        data.set('date', this.state.dueDate);
        data.set('course', this.props.courseId);
        axios({
            url: `${BACKEND}/teachers/assignment`,
            method: 'post',
            headers: {
            "Content-Type": "multipart/form-data"
            },
            data: data
        }).then(
            async response => {
                if (response && response.status === 200) {
                    swal({
                        title: "Success!",
                        text: `You have successfully posted the assignment!`,
                        icon: "success",
                    }).then(() => {
                        this.setState({submitting: false})
                        this.props.close();
                    })
                } else {
                    swal({
                        title: "Error!",
                        text: `There was an error posting your assignment, please try again!`,
                        icon: "error",
                    }).then(() => {
                        this.setState({submitting: false})
                    })
                }
            })
        })
    }

    render() {
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>
                    Post a new assignment for {this.props.courseName}
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
