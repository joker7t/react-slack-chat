import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { REGISTER_PATH } from "../../utils/Constant";
import firebase from "../../firebase";

class Login extends Component {
    constructor() {
        super();

        this.state = {
            'email': '',
            'password': '',
            'errorMessage': {
                'code': '',
                'message': ''
            },
            'isLoading': false
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    isFormEmpty = ({ username, email, password, confirmedPassword }) => {
        return email === '' || password === '';
    }

    isPasswordInValid = ({ password, confirmedPassword }) => {
        return password.length < 6;
    }

    isFormValid = () => {
        if (this.isFormEmpty(this.state)) {
            this.setState({
                errorMessage: {
                    'code': 'error',
                    'message': "Please input username and password"
                }
            });
            return false;
        } else if (this.isPasswordInValid(this.state)) {
            this.setState({
                errorMessage: {
                    'code': 'password',
                    'message': "Password is invalid"
                }
            });
            return false;
        } else {
            this.setState({
                errorMessage: {
                    'code': '',
                    'message': ''
                }
            });
            return true;
        }
    }

    isInputFieldHasError = (inputFieldName) => {
        if (this.state.errorMessage.code === inputFieldName ||
            this.state.errorMessage.code === 'error') {
            return 'error';
        } else {
            return '';
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        if (this.isFormValid()) {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({ isLoading: false });
                })
                .catch(e => {
                    console.log(e);
                    this.setState({
                        isLoading: false,
                        errorMessage: {
                            'code': 'error',
                            'message': e.message
                        }
                    });
                });
        } else {
            this.setState({ isLoading: false });
        }
    };

    isShownErrorMessage = () => {
        const { errorMessage } = this.state;
        if (errorMessage.code !== '') {
            return <Message error>
                <p>{errorMessage.message}</p>
            </Message>;
        }
    }

    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column className="max-width-grid-column">
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login for chat
                    </Header>
                    <Form size="large" onSubmit={this.onSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="email address"
                                className={this.isInputFieldHasError('email')}
                                onChange={this.onChange} type="text" value={this.state.email} />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password"
                                className={this.isInputFieldHasError('password')}
                                onChange={this.onChange} type="password" value={this.state.password} />

                            <Button disabled={this.state.isLoading}
                                className={this.state.isLoading ? "loading" : "ui button"}
                                color="violet"
                                fluid
                                type="submit">Submit</Button>
                        </Segment>
                    </Form>
                    {this.isShownErrorMessage()}
                    <Message>
                        <Link to={REGISTER_PATH}>Sign up</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;
