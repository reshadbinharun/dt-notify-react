import React, { Component } from 'react'
import { Container, Segment, Card, Button, Message } from 'semantic-ui-react'
import AssignmentModal from './AssignmentsModal';
import NewAssignmentModal from './NewAssignmentModal';
import MessageCourseModal from './MessageCourseModal';

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class Courses extends Component {
    constructor() {
        super();
        this.state = {
            openNewAssignment: false,
            openPastAssignments: false,
            openMessageModal: false,
            course: null
        }
        this.renderCourses = this.renderCourses.bind(this);
        this.openPastAssignments = this.openPastAssignments.bind(this);
        this.closePastAssignments = this.closePastAssignments.bind(this);
        this.openNewAssignment = this.openNewAssignment.bind(this);
        this.closeNewAssignment = this.closeNewAssignment.bind(this);
        this.openMessageModal = this.openMessageModal.bind(this);
        this.closeMessageModal = this.closeMessageModal.bind(this);
    }

    openPastAssignments(e, course) {
        e.preventDefault();
        this.setState({
            openPastAssignments: true,
            course
        });
    }

    closePastAssignments(e) {
        e.preventDefault();
        this.setState({
            openPastAssignments: false
        });
    }

    openNewAssignment(e, course) {
        e.preventDefault();
        this.setState({
            openNewAssignment: true,
            course
        });
    }

    closeNewAssignment() {
        this.setState({
            openNewAssignment: false
        });
    }

    openMessageModal(e, course) {
        e.preventDefault();
        this.setState({
            openMessageModal: true,
            course
        });
    }

    closeMessageModal() {
        this.setState({
            openMessageModal: false
        });
    }

    renderCourses() {
        return this.props.courses && this.props.courses.map(course => {
            return (
                <div>
                    <Card style ={{'width': '100%'}}>
                        <Card.Content>
                            <Card.Header>
                                {course.name}
                            </Card.Header>
                            <Card.Meta>
                                Grade: {course.grade}th
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                        <div className='ui three buttons'>
                            <Button basic color='brown'
                                onClick={(e) => this.openMessageModal(e, course)}
                            >
                                Message Class
                            </Button>
                            <Button basic color='brown'
                                onClick={(e) => this.openPastAssignments(e, course)}
                            >
                                Past Assignments
                            </Button>
                            <Button basic color='brown'
                                onClick={(e) => this.openNewAssignment(e, course)}
                            >
                                Post New Assignment
                            </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            )
        })
    }
    render() {
        const hasCourses = this.props.courses && this.props.courses.length
        const header = hasCourses ? `Here are your courses` : `Your are currently not assigned any courses`
        return (
            <Container>
                <Message
                    centered
                    header={header}
                    style = {messageStyle}
                />
                {
                    hasCourses ? 
                    <Segment>
                        <MessageCourseModal
                            open={this.state.openMessageModal}
                            courseId={this.state.course && this.state.course._id}
                            courseName={this.state.course && this.state.course.name}
                            close={this.closeMessageModal}
                        />
                        <AssignmentModal 
                            open={this.state.openPastAssignments}
                            courseName={this.state.course && this.state.course.name}
                            assignments={this.state.course && this.state.course.assignments}
                            close={this.closePastAssignments}
                        />
                        <NewAssignmentModal 
                            open={this.state.openNewAssignment}
                            close={this.closeNewAssignment}
                            courseId={this.state.course && this.state.course._id}
                            courseName={this.state.course && this.state.course.name}
                        />
                        {this.renderCourses()}
                    </Segment> : 
                    null 
                }
            </Container>
        )
    }
}