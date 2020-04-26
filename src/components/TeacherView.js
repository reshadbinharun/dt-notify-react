import React, { Component } from 'react'
import { Menu, Segment} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
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
            courses: []
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    async componentDidMount() {
        this.setState({fetching: true});
        const endPoint = `/teachers/courses/${this.props.user._id}`
        try {
            const result = await makeCall({}, endPoint, 'get')
            if (result && !result.error) {
                this.setState({
                    fetching: false,
                    courses: result.courses
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
                    id={this.props.user._id}
                    name={this.props.user.name}
                    phone={this.props.user.phone}
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
        if (!this.props.isLoggedIn) {
            return <Redirect to="/login" />
        }
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
