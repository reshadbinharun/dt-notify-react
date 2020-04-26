import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
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
            assignments: [],
            fetching: true
        }
    }

    async componentDidMount() {
        this.setState({fetching: true});
        const endPoint = `/students/assignments/${this.props.user._id}`
        try {
            const result = await makeCall({}, endPoint, 'get')
            if (result && !result.error) {
                console.log(result)
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
                    id={this.props.user._id}
                    name={this.props.user.name}
                    phone={this.props.user.phone}
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
