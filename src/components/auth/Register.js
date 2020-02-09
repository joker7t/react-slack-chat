import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { LOGIN_PATH } from "../../utils/Constant";
import firebase from "../../firebase";

class Register extends Component {
    constructor() {
        super();

        this.state = {
            'username': '',
            'email': '',
            'password': '',
            'confirmedPassword': ''
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => console.log(createdUser))
            .catch(e => console.log(e));
    };

    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column className="max-width-grid-column">
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for chat
                    </Header>
                    <Form size="large" onSubmit={this.onSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username"
                                onChange={this.onChange} type="text" value={this.state.username} />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="email address"
                                onChange={this.onChange} type="text" value={this.state.email} />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password"
                                onChange={this.onChange} type="password" value={this.state.password} />
                            <Form.Input fluid name="confirmedPassword" icon="repeat" iconPosition="left" placeholder="password confirmation"
                                onChange={this.onChange} type="password" value={this.state.confirmedPassword} />
                            <Button className="ui button" type="submit">Submit</Button>
                        </Segment>
                    </Form>

                    <Message>
                        Already a user? <Link to={LOGIN_PATH}>Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;
