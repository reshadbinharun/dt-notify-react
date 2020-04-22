import React, { Component } from 'react'
import { Menu, Segment} from 'semantic-ui-react'
import Profile from "./Profile";
import Courses from "./Courses";
import { makeCall } from "../apis";

export const PROFILE = 'Profile';
export const COURSES = 'Courses';

export default class TeacherView extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: COURSES,
            fetching: true,
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
            ]
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    async componentDidMount() {
        this.setState({fetching: true});
        const endPoint = `/courses/${this.props.id}`
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
            console.log("Error: TeacherView#componentDidMount", e)
        }
    }

    renderNavSelection() {
        switch(this.state.activeItem) {
            case PROFILE:
                return <Profile
                    role={'TEACHER'}
                    id={this.props.id}
                    name={this.props.name}
                    phone={this.props.phone}
                />
            case COURSES:
                return <Courses
                    courses={this.state.courses}
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
                    name={COURSES}
                    active={activeItem === COURSES}
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
