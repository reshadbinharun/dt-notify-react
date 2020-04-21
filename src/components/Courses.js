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
            // TODO: remove mock data
            courses: [
                {
                    id: '1',
                    name: 'Dummy course',
                    grade: '11th',
                    assignments: [
                        {
                            name: 'First assignment',
                            submissionLink: 'https://www.google.com',
                            fileLocation: 'https://www.facebook.com',
                            date: '20-04-2020'
                        },
                        {
                            name: 'Second assignment',
                            submissionLink: 'https://www.google.com',
                            fileLocation: 'https://www.facebook.com',
                            date: '21-04-2020'
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Dummy course2',
                    grade: '9th',
                    assignments: [
                        {
                            name: 'Third assignment',
                            submissionLink: 'https://www.google.com',
                            fileLocation: 'https://www.facebook.com',
                            date: '20-04-2020'
                        },
                        {
                            name: 'Fourth assignment',
                            submissionLink: 'https://www.google.com',
                            fileLocation: 'https://www.facebook.com',
                            date: '21-04-2020'
                        }
                    ]
                }
            ],
            openNewAssignment: false,
            openPastAssignments: false,
            openMessageModal: false
        }
        this.renderCourses = this.renderCourses.bind(this);
        this.openPastAssignments = this.openPastAssignments.bind(this);
        this.closePastAssignments = this.closePastAssignments.bind(this);
        this.openNewAssignment = this.openNewAssignment.bind(this);
        this.closeNewAssignment = this.closeNewAssignment.bind(this);
        this.openMessageModal = this.openMessageModal.bind(this);
        this.closeMessageModal = this.closeMessageModal.bind(this);
    }

    openPastAssignments(e) {
        e.preventDefault();
        this.setState({
            openPastAssignments: true
        });
    }

    closePastAssignments(e) {
        e.preventDefault();
        this.setState({
            openPastAssignments: false
        });
    }

    openNewAssignment(e) {
        e.preventDefault();
        this.setState({
            openNewAssignment: true
        });
    }

    closeNewAssignment(e) {
        e.preventDefault();
        this.setState({
            openNewAssignment: false
        });
    }

    openMessageModal(e) {
        e.preventDefault();
        this.setState({
            openMessageModal: true
        });
    }

    closeMessageModal(e) {
        e.preventDefault();
        this.setState({
            openMessageModal: false
        });
    }

    renderCourses() {
        return this.state.courses && this.state.courses.map(course => {
            return (
                <div>
                    <MessageCourseModal
                        open={this.state.openMessageModal}
                        courseId={course.id}
                        courseName={course.name}
                        close={this.closeMessageModal}
                    />
                    <AssignmentModal 
                        open={this.state.openPastAssignments}
                        courseName={course.name}
                        assignments={course.assignments}
                        close={this.closePastAssignments}
                    />
                    <NewAssignmentModal 
                        open={this.state.openNewAssignment}
                        close={this.closeNewAssignment}
                        courseId={course.id}
                    />
                    <Card style ={{'width': '100%'}}>
                        <Card.Content>
                            <Card.Header>
                                {course.name}
                            </Card.Header>
                            <Card.Meta>
                                Grade: {course.grade}
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                        <div className='ui three buttons'>
                            <Button basic color='brown'
                                onClick={this.openMessageModal}
                            >
                                Message Class
                            </Button>
                            <Button basic color='brown'
                                onClick={this.openPastAssignments}
                            >
                                Past Assignments
                            </Button>
                            <Button basic color='brown'
                                onClick={this.openNewAssignment}
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
        const hasCourses = this.state.courses && this.state.courses.length
        const header = hasCourses ? `Here are your courses` : `Your are currently not assigned any courses`
        return (
            <Container>
                <Message
                    centered
                    content={header}
                    style = {messageStyle}
                />
                {
                    hasCourses ? 
                    <Segment>
                        {this.renderCourses()}
                    </Segment> : 
                    null 
                }
            </Container>
        )
    }
}