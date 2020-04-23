import React, { Component } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'
import swal from 'sweetalert';
import { BACKEND } from "../apis";
/*
    assignmentId
    studentId
*/
export default class AssignmentSubmitModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            submitting: false
        }
        this.selectFile = this.selectFile.bind(this);
        this.submitAssignment = this.submitAssignment.bind(this);
    }

    selectFile(e) {
        e.preventDefault();
        this.setState({
            file: e.target.files[0]
        })
    }

    submitAssignment(e) {
        // TODO: test this API
        this.setState({
            submitting: true
        }, () => {
            let data = new FormData();
            data.append('file', this.state.file);
            data.append('assignmentId', this.props.assignmentId);
            data.append('studentId', this.props.studentId);
            fetch(`${BACKEND}/submitAssignment`, {
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
                    text: `You have successfully submitted the assignment!`,
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
                    Submit your assignment
                </Modal.Header>
                <Modal.Content>
                    <Form disabled={this.state.submitting}>
                        <Form.Field>
                            <label>Upload a .pdf or text of the assignment</label>
                            <input type="file" onChange={this.selectFile} class="ui huge brown center floated button"/>
                        </Form.Field>
                        <Button
                            basic
                            color="brown"
                            onClick={this.submitAssignment}
                            loading={this.state.submitting}
                            disabled={this.state.submitting}
                        >
                            Submit Assignment!
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.close}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
