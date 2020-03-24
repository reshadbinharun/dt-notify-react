import React, { Component } from 'react';
import { Card, Grid, Message, Select, Button, Modal, Form } from 'semantic-ui-react';
import SearchBar from "./SearchBar";
import swal from 'sweetalert';
import { makeCall } from '../apis';

const compName = 'Tracking_LS';

const gradeOptions = ['All Grades','9th', '10th', '11th', '12th'].map(val => {
    return {key: val, text: val, value: val}
});

const MAX_CHARS_MESSAGE = 1000;

export default class StaffView extends Component {
    constructor(props){
        super(props);
        this.state = {
            students: [
                {
                    name: 'Reshad',
                    email: 'reshad@gmail.com',
                    grade: '9th'
                },
                {
                    name: 'Stam',
                    email: 'stam@gmail.com',
                    grade: '10th'
                },
                {
                    name: 'Ashish',
                    email: 'ashish@gmail.com',
                    grade: '12th'
                }
            ],
            searchTerms: '',
            searchMode: false,
            searchGrade: '',
            modalOpen: false,
            message: '',
            recipientEmail: '',
            recipientName: '',
            sendingRequest: false
        }
        this.generateStudentList = this.generateStudentList.bind(this);
        this.updateSearchTerms = this.updateSearchTerms.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openMessageModal = this.openMessageModal.bind(this);
        this.closeMessageModal = this.closeMessageModal.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.filterResults = this.filterResults.bind(this);
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
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    handleChange(e) {
        e.preventDefault();
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    sendMessage(e) {
        e.preventDefault();
        this.setState({
            sendingRequest: true
        }, () => {
            const email = this.state.recipientEmail;
            const message = this.state.message;
            makeCall({email, message}, '/staff/sendMessage', 'post').then(result => {
                this.setState({
                    sendingRequest: false,
                    modalOpen: false,
                    message: '',
                    recipientEmail: ''
                });
                if (!result || result.error) {
                    swal({
                        title: "Error!",
                        text: "There was an error messaging the student, please try again.",
                        icon: "error",
                    });
                } else {
                    swal({
                        title: "Success!",
                        text: "You have successfully messaged the studen.",
                        icon: "success",
                    });
                }
            });
        })
    }

    openMessageModal(e, email, name) {
        e.preventDefault();
        this.setState({
            modalOpen: true,
            recipientEmail: email,
            recipientName: name
        })
    }

    closeMessageModal(e) {
        e.preventDefault();
        this.setState({
            modalOpen: false,
            recipientEmail: '',
            recipientName: '',
            message: ''
        })
    }

    generateStudentList(StudentObjects) {
        return StudentObjects && StudentObjects.map(student => {
            return (
                <Card style={{'width': '80%'}}>
                    <Grid>
                        <Grid.Column width={4}
                            style={{'margin': '2px 0 2px 0'}}
                        >
                            <b>{student.name}</b>
                        </Grid.Column>
                        <Grid.Column>
                            <div> | </div>
                        </Grid.Column>
                        <Grid.Column width={4}
                            style={{'margin': '2px 0 2px 0'}}
                        >
                            <div> {student.grade} Grade </div>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Modal
                                open={this.state.modalOpen}
                            >
                                <Modal.Header>Messaging {this.state.recipientName}</Modal.Header>
                                <Modal.Content>
                                    <Form onSubmit={this.sendMessage}>
                                    <Form.Field
                                        type="text">
                                            <label>Message</label>
                                            <input maxlength={MAX_CHARS_MESSAGE} placeholder='Your message...' name="message" onChange={this.handleChange} value={this.state.message} />
                                        </Form.Field>
                                        <Button 
                                            color="blue" 
                                            type='submit'
                                            loading={this.state.sendingRequest}
                                            disabled={!this.state.message || this.state.sendingRequest}
                                        >
                                            Send
                                        </Button>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button onClick={this.closeMessageModal}>
                                        Done
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                            <Button
                                disabled={this.state.sendingRequest}
                                style={{'height':'80%', 'margin': '2px 0 2px 0'}}
                                onClick={(e) => this.openMessageModal(e, student.email, student.name)}
                            >
                                Message
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Card>
            )
        });
    }

    updateSearchTerms(e, searchObject) {
        let searchTerms = searchObject.value;
        e.preventDefault();
        this.setState({
            searchMode: true,
            searchTerms: searchTerms
        })
        if (!searchTerms && !this.state.searchGrade) {
            this.setState({
                searchMode: false
            })
        }
    }

    handleChangeGrade(e, {value}) {
        e.preventDefault();
        this.setState({
            searchGrade: value,
            searchMode: true
        })
    }

    getBagofWords(student) {
        return [student.name, student.email];
    }

    clearSearch(e) {
        e.preventDefault();
        this.setState({
            searchMode: false,
            searchTerms: '',
            searchGrade: ''
        })
    }

    filterResults(StudentObjects) {
        // eslint-disable-next-line
        let gradeFilteredStudents = StudentObjects;
        if (this.state.searchGrade && this.state.searchGrade !== 'All Grades') {
            gradeFilteredStudents = StudentObjects.filter(student => {
                return student.grade === this.state.searchGrade
            });
        }
        if (this.state.searchTerms) {
            return gradeFilteredStudents.filter(student => {
                let bagOfWords = this.getBagofWords(student);
                let searchTerms = this.state.searchTerms;
                for (let i = 0; i < bagOfWords.length; i++) {
                    if (bagOfWords[i].toLowerCase().includes(searchTerms.toLowerCase())) {
                        return true;
                    }
                }
            })
        }
        return gradeFilteredStudents;
    }

    render() {
        const cardStyle ={
            width: '100%',
            padding: '5px',
            margin: '5px',
        }
        return (
            <Card centered={true} style={cardStyle}>
                <Grid centered={true} rows={3}>
                    <Grid.Row centered style={{'margin': "20px 0 10px 0"}}>
                        <Grid.Column width={5}> 
                            <Select placeholder='Select Grade...' options={gradeOptions} onChange={this.handleChangeGrade}/> 
                        </Grid.Column>
                        <Grid.Column width={5}> 
                            <SearchBar
                                onSearchMode={this.updateSearchTerms}
                                searchValue={this.state.searchTerms}
                            /> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Message
                            style={{'margin': "20px 0 10px 0"}}
                            content={`The following are all the verified and approved students in the system.`}
                        />
                    </Grid.Row>
                    <Grid.Row
                        style={{'margin': '10px 0 10px 0'}}
                    >
                        {
                            this.state.searchMode ?
                            this.generateStudentList(this.filterResults(this.state.students)) :
                            this.generateStudentList(this.state.students)
                        }
                    </Grid.Row>
                </Grid>
            </Card>
        )
    }
}
