import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Messaging from './Messaging'
import Management from './Management'
import Tracking from './Tracking'
import CourseManagement from './CourseManagement'

export const MESSAGING = 'Messaging';
export const STUDENT_MANAGEMENT = 'Student Management';
export const STUDENT_TRACKING = 'Student Tracking';
export const STAFF_MANAGEMENT = 'Staff Management'
export const STAFF_TRACKING = 'Staff Tracking'
export const COURSES = 'Courses'

export default class StaffView extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MESSAGING
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MESSAGING:
                return <Messaging/>
            case STUDENT_MANAGEMENT:
                return <Management
                    isStudentView={true}
                />
            case STUDENT_TRACKING:
                return <Tracking
                    isStudentView={true}
                />
            case STAFF_MANAGEMENT:
                return <Management
                    isStudentView={false}
                />
            case STAFF_TRACKING:
                return <Tracking
                isStudentView={false}
            />
            case COURSES:
                return <CourseManagement/>
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
        <div>
            <Menu pointing>
                <Menu.Item 
                    name={MESSAGING}
                    active={activeItem === MESSAGING}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={STUDENT_MANAGEMENT}
                    active={activeItem === STUDENT_MANAGEMENT}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={STUDENT_TRACKING}
                    active={activeItem === STUDENT_TRACKING}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={STAFF_MANAGEMENT}
                    active={activeItem === STAFF_MANAGEMENT}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name={STAFF_TRACKING}
                    active={activeItem === STAFF_TRACKING}
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
