import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { makeCall } from "../apis";
import swal from "sweetalert"

/*
courseId
courseName
*/
export default class DeleteCourseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendingRequest: false
        }
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    confirmDelete(e) {
        e.preventDefault();
        this.setState({
            sendingRequest: true
        }, async () => {
            try {
                const result = await makeCall({}, `/course/${this.props.courseId}`, 'post');
                this.setState({
                    sendingRequest: false,
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
                    }, () => {
                        this.props.close()
                    });
                }
            } catch (e) {
                this.setState({
                    sendingRequest: false,
                });
                console.log("Error: DeleteCourseModal#confirmDelete", e);
            }
        })
    }

    render() {
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>Are you sure you want to delete {this.props.courseName}?</Modal.Header>
                <Modal.Actions>
                    <Button onClick={this.confirmDelete}>
                        Yes!
                    </Button>
                    <Button onClick={this.props.close}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
