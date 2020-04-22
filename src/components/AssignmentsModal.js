import React, { Component } from 'react'
import { Modal, Card, Button } from 'semantic-ui-react'

/*
    assignments: [
        {
            name: 'First assignment',
            submissionLink: 'www.google.com',
            fileLocation: 'www.facebook.com',
            date: '20-04-2020'
        },
        {
            name: 'Second assignment',
            submissionLink: 'https://www.google.com',
            fileLocation: 'https://www.facebook.com',
            date: '21-04-2020'
        }
    ],
    courseName: Dummy course
*/
export default class AssignmentModal extends Component {
    constructor(props) {
        super(props);
        this.renderAssignments = this.renderAssignments.bind(this);
    }

    renderAssignments() {
        return this.props.assignments && this.props.assignments.map(assignment => {
            return <Card style ={{'width': '100%'}}>
                <Card.Content>
                    <Card.Header>
                        {assignment.name}
                    </Card.Header>
                    <Card.Meta>
                        Date due: {assignment.date}
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='brown'
                        onClick={() => window.open(`${assignment.submissionLink}`)}
                    >
                        Assignment Submissions
                    </Button>
                    <Button basic color='brown'
                        onClick={() => window.open(`${assignment.fileLocation}`)}
                    >
                        Assignment File
                    </Button>
                    </div>
                </Card.Content>
            </Card>
        })
    }

    render() {
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>
                    {this.props.courseName}: Assignments
                </Modal.Header>
                <Modal.Content>
                    {
                        this.props.assignments && this.props.assignments.length ? this.renderAssignments() :
                        <Card style ={{'width': '100%'}}>
                        <Card.Meta>
                            There are currently no assignments posted for {this.props.courseName}
                        </Card.Meta>
                        </Card>
                    }
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
