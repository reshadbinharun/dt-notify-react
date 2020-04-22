import React, { Component } from 'react'
import { Container, Segment, Card, Button, Message } from 'semantic-ui-react'

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class Assignments extends Component {
    constructor() {
        super();
        this.state = {
        }
        this.renderAssignments = this.renderAssignments.bind(this);
    }

    renderAssignments() {
        return this.props.assignments && this.props.assignments.map(assignment => {
            return (
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