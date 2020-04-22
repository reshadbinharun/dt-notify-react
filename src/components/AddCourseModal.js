import React, { Component } from 'react'
import { Modal, Form, Select, Button } from 'semantic-ui-react'
import swal from "sweetalert"
import { makeCall } from "../apis"

const gradeOptions = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(grade => {
    return {
        text: grade,
        key: grade,
        value: grade
    }
})

/*
teachers: [
    {
        name: ''
        id: ''
    }
]
*/
export default class AddCourseModal extends Component {
    constructor() {
        super();
        this.state = {
            course: '',
            teacherId: '',
            grade: '',
            sendingRequest: false
        }
        this.handleGradeSelect = this.handleGradeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTeacherSelect = this.handleTeacherSelect.bind(this);
        this.addCourse = this.addCourse.bind(this);
    }

    handleGradeSelect(e, {value}) {
        e.preventDefault();
        this.setState({
            grade: value
        })
    }

    handleTeacherSelect(e, {value}) {
        e.preventDefault();
        this.setState({
            teacherId: value
        })
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    async addCourse(e) {
        e.preventDefault();
        this.setState({sendingRequest: true});
        const payload = {
            teacherId: this.state.teacherId,
            grade: this.state.grade,
            course: this.state.course
        };
        const endPoint = '/staff/course'
        try {
            const result = await makeCall(payload, endPoint, 'post')
            if (!result || result.error) {
                this.setState({
                    sendingRequest: false
                }, () => {
                    swal({
                        title: "Error!",
                        text: `There was an error adding the course, please try again.`,
                        icon: "error",
                    });
                });
            } else {
                this.setState({
                    sendingRequest: false,
                    course: '',
                    grade: '',
                    teacherId: ''
                }, () => {
                    swal({
                        title: "Success!",
                        text: `You've successfully added the course!`,
                        icon: "success",
                    });
                    this.props.close();
                });
            }
        } catch (e) {
            console.log("Error: AddCourseModal#addCourse", e)
        }
    }

    render() {
        const teacherOptions = this.props.teachers && this.props.teachers.map(teacher => {
            return {
                key: teacher.id,
                value: teacher.id,
                text: teacher.name
            }
        })
        return (
            <Modal
                open={this.props.open}
            >
                <Modal.Header>
                    Add a New Course
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.addCourse}>
                        <Form.Field>
                            <label>Course Name</label>
                            <input type="text" placeholder='Name of course...' name="course" onChange={this.handleChange} value={this.state.password} />
                        </Form.Field>
                        <Form.Field>
                            <label>Select your grade</label>
                            <Select compact options={gradeOptions} defaultValue={null} name="grade" onChange={this.handleGradeSelect}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Select a teacher</label>
                            <Select compact options={teacherOptions} defaultValue={null} name="teacherId" onChange={this.handleTeacherSelect}/>
                        </Form.Field>
                        <Button 
                            color="blue" 
                            type='submit'
                            loading={this.state.sendingRequest}
                            disabled={!this.state.teacherId || !this.state.course || !this.state.grade || this.state.sendingRequest}
                        >
                            Add Course
                        </Button>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.close}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
