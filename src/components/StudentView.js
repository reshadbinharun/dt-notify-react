import React, { Component } from 'react'
import { Menu, Segment, Container} from 'semantic-ui-react'
import Profile from "./Profile";
import Assignments from "./Assignments";
import { makeCall } from "../apis";

export const PROFILE = 'Profile';
export const ASSIGNMENTS = 'Assignments';

export default class StudentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: ASSIGNMENTS,
            // TODO: remove mock data
            assignments: [
                {
                    id: '1',
                    name: 'Third assignment',
                    course: 'dummy course',
                    submissionLink: 'https://www.google.com',
                    fileLocation: 'https://www.facebook.com',
                    date: '20-04-2020'
                },
                {
                    id: '2',
                    name: 'Fourth assignment',
                    course: 'dummy course2',
                    submissionLink: 'https://www.google.com',
                    fileLocation: 'https://www.facebook.com',
                    date: '21-04-2020'
                }
            ],
            fetching: true
        }
    }

    async componentDidMount() {
        this.setState({fetching: true});
        const endPoint = `/assignments/${this.props.id}`
        try {
            const result = await makeCall({}, endPoint, 'get')
            if (!result || result.error) {
                this.setState({
                    fetching: false,
                    assignments: result.assignments
                });
            } else {
                this.setState({
                    fetching: false
                });
            }
        } catch (e) {
            this.setState({fetching: false});
            console.log("Error: StudentView#componentDidMount", e)
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case PROFILE:
                return <Profile
                    role={'STUDENT'}
                    id={this.props.id}
                    name={this.props.name}
                    phone={this.props.phone}
                />
            case ASSIGNMENTS:
                return <Assignments
                    assignments={this.state.assignments}
                    studentId={this.props.id}
                />
            default:
                return null
        }
    }

    render() {
        const { activeItem } = this.state
        return (
            <Segment loading={this.state.fetching}>
                <Menu pointing>
                    <Menu.Item 
                        name={PROFILE}
                        active={activeItem === PROFILE}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name={ASSIGNMENTS}
                        active={activeItem === ASSIGNMENTS}
                        onClick={this.handleItemClick}
                    />
                </Menu>
                <Segment>
                    {this.renderNavSelection()}
                </Segment>
            </Segment>
        )
    }
}
