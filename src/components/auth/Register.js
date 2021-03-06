import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { LOGIN_PATH, HOME_PATH } from "../../utils/Constant";
import firebase from "../../firebase";
import md5 from 'md5';
import _ from "lodash";

class Register extends Component {
    constructor() {
        super();

        this.state = {
            'username': '',
            'email': '',
            'password': '',
            'confirmedPassword': '',
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
        return username === '' || email === '' || password === '' || confirmedPassword === '';
    }

    isPasswordInValid = ({ password, confirmedPassword }) => {
        if (password.length < 6 || confirmedPassword.length < 6) {
            return true;
        } else if (password !== confirmedPassword) {
            return true
        }
        return false;
    }

    isFormValid = () => {
        if (this.isFormEmpty(this.state)) {
            this.setState({
                errorMessage: {
                    'code': 'error',
                    'message': "Please fullfill all fields"
                }
            });
            return false;
        } else if (this.isPasswordInValid(this.state)) {
            this.setState({
                errorMessage: {
                    'code': 'password',
                    'message': "Password is invalid or not match with password confirmation"
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
        if (this.state.errorMessage.code === inputFieldName) {
            return 'error';
        } else {
            return '';
        }
    }

    saveUser = (createdUser) => {
        return firebase.database().ref('users').child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        if (this.isFormValid()) {
            try {
                const createdUser = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password);
                await createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                });
                //no need to wait this method
                this.saveUser(createdUser);

                this.props.history.push(LOGIN_PATH);
                console.log(createdUser);

            }

            catch (e) {
                this.setState({
                    errorMessage: {
                        'code': 'email',
                        'message': e.message
                    },
                    isLoading: false
                });
                console.log(e);
            };
        };
        this.setState({ isLoading: false });
    }

    isShownErrorMessage = () => {
        const { errorMessage } = this.state;
        if (errorMessage.code !== '') {
            return <Message error>
                <p>{errorMessage.message}</p>
            </Message>;
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.users)) {
            this.props.history.push(HOME_PATH);
        }
    }

    // componentDidUpdate() {
    //     if (!_.isEmpty(this.props.users)) {
    //         this.props.history.push(LOGIN_PATH);
    //     }
    // }

    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app" style={{ margin: '0' }}>
                <Grid.Column className="max-width-grid-column">
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for chat
                    </Header>
                    <Form size="large" onSubmit={this.onSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username"
                                className={this.isInputFieldHasError('username')}
                                onChange={this.onChange} type="text" value={this.state.username} />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="email address"
                                className={this.isInputFieldHasError('email')}
                                onChange={this.onChange} type="text" value={this.state.email} />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password"
                                className={this.isInputFieldHasError('password')}
                                onChange={this.onChange} type="password" value={this.state.password} />
                            <Form.Input fluid name="confirmedPassword" icon="repeat" iconPosition="left" placeholder="password confirmation"
                                className={this.isInputFieldHasError('password')}
                                onChange={this.onChange} type="password" value={this.state.confirmedPassword} />

                            <Button disabled={this.state.isLoading}
                                className={this.state.isLoading ? "loading" : "ui button"}
                                color="orange"
                                fluid
                                type="submit">Submit</Button>
                        </Segment>
                    </Form>
                    {this.isShownErrorMessage()}
                    <Message>
                        Already a user? <Link to={LOGIN_PATH}>Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;