import React, { Component } from 'react'
import { Container,  Card, Button, Message } from 'semantic-ui-react'
import AssignmentSubmitModal from "./AssignmentSubmitModal"

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

/*
    assignments: [],
    studentId
*/
export default class Assignments extends Component {
    constructor() {
        super();
        this.state = {
            openSubmitModal: false
        }
        this.renderAssignments = this.renderAssignments.bind(this);
        this.openSubmitModal = this.openSubmitModal.bind(this);
        this.closeSubmitModal = this.closeSubmitModal.bind(this);
    }

    openSubmitModal(e) {
        this.setState({
            openSubmitModal: true
        })
    }

    closeSubmitModal(e) {
        this.setState({
            openSubmitModal: false
        })
    }

    renderAssignments() {
        return this.props.assignments && this.props.assignments.map(assignment => {
            return (
                <Container>
                    <AssignmentSubmitModal
                        open={this.state.openSubmitModal}
                        close={this.closeSubmitModal}
                        assignmentId={assignment.id}
                        studentId={this.props.studentId}
                    />
                    <Card style ={{'width': '100%'}}>
                        <Card.Content>
                            <Card.Header>
                                {assignment.name}
                            </Card.Header>
                            <Card.Meta>
                                <b>Course: {assignment.course}</b>
                            </Card.Meta>
                            <Card.Meta>
                                Date due: {assignment.date}
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='brown'
                                    onClick={this.openSubmitModal}
                                >
                                    Submit Assignment
                                </Button>
                                <Button basic color='brown'
                                    onClick={() => window.open(`${assignment.fileLocation}`)}
                                >
                                    Assignment File
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </Container>
            )
        })
    }
    render() {
        const hasAssignments = this.props.assignments && this.props.assignments.length
        const header = hasAssignments ? `Here are your assignments` : `You have no assignments`
        return (
            <Container>
                <Message
                    centered
                    header={header}
                    style = {messageStyle}
                />
                    {
                        hasAssignments ? 
                        this.renderAssignments() :
                        null
                    } 
            </Container>
        )
    }
}