import React, { Component } from 'react';
import {Grid, Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {primary, secondary} from "../colors";

const style = {
    'paddingTop': '50px'
}

/*
props:
- loggedIn: boolean
- logout: ()
*/
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.renderLoginStateInfo = this.renderLoginStateInfo.bind(this);
    }
    
    renderLoginStateInfo() {
        // TODO: Use store to fetch state
        return (
        <Grid.Column 
            width = {6}
            style = {style}
        >
            <Button 
                style={
                    {
                        'background': secondary,
                        'color': primary
                    }
                } 
                class="ui button" 
                onClick={this.props.logout}
            >
                Log Out
            </Button>
        </Grid.Column>)
    }

    renderLogo() {
        return (
            <img style={{'paddingTop': '30px'}} className="ui small image centered" src={require("./logo.png")} alt="logo"/>
        )
    }
    render () {
        return (
            <Grid columns={3}>
                <Grid.Column width = {5}>
                    <div></div>
                </Grid.Column>
                <Grid.Column width = {5}>
                    {this.renderLogo()}
                </Grid.Column>
                {this.props.loggedIn ? this.renderLoginStateInfo() : null}
            </Grid>
        )
    }
}