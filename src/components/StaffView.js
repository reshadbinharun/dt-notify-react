import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import Messaging from './Messaging'

const compName = 'StaffView_LS';

export const MESSAGING = 'Messaging';
export const STUDENT_MANAGEMENT = 'Student Management';
export const STUDENT_TRACKING = 'Student Tracking';
export const STAFF_MANAGEMENT = 'Staff Management'
export const STAFF_TRACKING = 'Staff Tracking'

//TODO: adapt to mentee login model --> currently copied from mentor login
export default class StaffView extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: MESSAGING,
            data: {},
        }
    }

    componentCleanup() {
        sessionStorage.setItem(compName, JSON.stringify(this.state));
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
        const persistState = sessionStorage.getItem(compName);
            if (persistState) {
            try {
                this.setState(JSON.parse(persistState));
            } catch (e) {
                console.log("Could not get fetch state from local storage for", compName);
            }
        }
        this.setState({
            data: this.props.payload.mentee
        })
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    renderNavSelection() {
        switch(this.state.activeItem) {
            case MESSAGING:
                return <Messaging/>
            case STUDENT_MANAGEMENT:
                return <div>Student Management</div>
            case STUDENT_TRACKING:
                return <div>Student Tracking</div>
            case STAFF_MANAGEMENT:
                return <div>Staff Management</div>
            case STAFF_TRACKING:
                return <div>Staff Tracking</div>
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
            </Menu>
            <Segment>
                {this.renderNavSelection()}
            </Segment>
        </div>
        )
    }
}
