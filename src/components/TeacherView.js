import React, { Component } from 'react'
import { Menu, Segment} from 'semantic-ui-react'
import Profile from "./Profile";
import Courses from "./Courses";

export const PROFILE = 'Profile';
export const COURSES = 'Courses';

export default class TeacherView extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: COURSES
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case PROFILE:
                return <Profile
                    isStudentView={false}
                />
            case COURSES:
                return <Courses
                />
            default:
                return null
        }
    }

    render() {
        const { activeItem } = this.state
        return (
        <div>
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
        </div>
        )
    }
}
