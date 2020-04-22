import React, { Component } from 'react'
import { Segment, Card, Button, Message, Grid } from 'semantic-ui-react'
import { makeCall } from "../apis";
import DeleteCourseModal from "./DeleteCourseModal"
import AddCourseModal from "./AddCourseModal"

let messageStyle = {
    padding: '20px',
    margin: '10px',
}

export default class CourseManagement extends Component {
    constructor() {
        super();
        this.state = {
            courses: [
                {
                    id: '1',
                    name: 'dummy course',
                    teacher: 'teacher 1',
                    grade: '11th'
                },
                {
                    id: '2',
                    name: 'dummy course2',
                    teacher: 'teacher 2',
                    grade: '12th'
                },
            ],
            teachers: [
                {
                    id: '1',
                    name: 'teacher 1'
                },
                {
                    id: '2',
                    name: 'teacher 2'
                },
                {
                    id: '3',
                    name: 'teacher 3'
                }
            ],
            fetching: true,
            showConfirmDeleteModal: false,
            showAddCourseModal: false,
            courseIdToDelete: '',
            courseNameToDelete: ''

        }
        this.renderCourses = this.renderCourses.bind(this);
        this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
        this.showAddCourseModal = this.showAddCourseModal.bind(this);
        this.closeDeleteCourseModal = this.closeDeleteCourseModal.bind(this);
        this.closeAddCourseModal = this.closeAddCourseModal.bind(this);
    }

    showConfirmDeleteModal(e, course) {
        e.preventDefault();
        this.setState({
            showConfirmDeleteModal: true,
            courseIdToDelete: course.id,
            courseNameToDelete: course.name
        })
    }

    closeDeleteCourseModal(e) {
        e.preventDefault();
        this.setState({
            showConfirmDeleteModal: false
        })
    }

    closeAddCourseModal(e) {
        e.preventDefault();
        this.setState({
            showAddCourseModal: false
        })
    }

    showAddCourseModal(e) {
        e.preventDefault();
        this.setState({
            showAddCourseModal: true,
        })
    }

    async componentDidMount() {
        const endPoint = `/coursesAndTeachers`
        try {
            const result = await makeCall({}, endPoint, 'get')
            if (!result || result.error) {
                this.setState({
                    fetching: false,
                    courses: result.courses,
                    teachers: result.teachers,
                });
            } else {
                this.setState({
                    fetching: false
                });
            }
        } catch (e) {
            this.setState({fetching: false});
            console.log("Error: StaffView#componentDidMount", e)
        }
    }

    renderCourses() {
        return this.state.courses && this.state.courses.map(course => {
            return (
                <Card style ={{'width': '100%'}}>
                    <Card.Content>
                        <Grid columns={2}>
                            <Grid.Column width={12}>
                                <Card.Header>
                                    {course.name}
                                </Card.Header>
                                <Card.Meta>
                                    <b>Grade: {course.grade}</b>
                                </Card.Meta>
                                <Card.Meta>
                                    Teacher: {course.teacher}
                                </Card.Meta>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Button
                                    onClick={(e) => this.showConfirmDeleteModal(e, course)}
                                    basic color='red'
                                >
                                    Delete Course
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>
            )
        })
    }
    render() {
        const coursesPresent = this.state.courses && this.state.courses.length
        const header = coursesPresent ? `There are all courses at your school` : `You have not created any courses`
        return (
            <Segment loading={this.state.fetching}>
                <DeleteCourseModal
                    open={this.state.showConfirmDeleteModal}
                    courseId={this.state.courseIdToDelete}
                    courseName={this.state.courseNameToDelete}
                    close={this.closeDeleteCourseModal}
                />
                <AddCourseModal
                    open={this.state.showAddCourseModal}
                    teachers={this.state.teachers}
                    close={this.closeAddCourseModal}
                />
                <Message
                    centered
                    header={header}
                    style = {messageStyle}
                />
                <Button
                    onClick={this.showAddCourseModal}
                    basic color='brown'
                >
                    Add New Course
                </Button>
                {
                    coursesPresent ? 
                    this.renderCourses() :
                    null
                } 
            </Segment>
        )
    }
}