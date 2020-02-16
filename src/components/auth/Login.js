import React, { Component } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { REGISTER_PATH, HOME_PATH } from "../../utils/Constant";
import firebase from "../../firebase";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signIn } from "../../actions/userAction";
import _ from 'lodash';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            'email': '',
            'password': '',
            'errorMessage': {},
            'isLoading': false
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    isFormEmpty = ({ email, password }) => {
        return email === '' || password === '';
    }

    isPasswordInValid = ({ password }) => {
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
                errorMessage: {}
            });
            return true;
        }
    }

    isInputFieldHasError = (inputFieldName) => {
        const { errorMessage } = this.state;
        if (!_.isEmpty(errorMessage) &&
            (errorMessage.code === inputFieldName || errorMessage.code === 'error')) {
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
                    this.props.signIn(signedInUser);
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
        if (!_.isEmpty(errorMessage)) {
            return <Message error>
                <p>{errorMessage.message}</p>
            </Message>;
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.user.user)) {
            this.props.history.push(HOME_PATH);
        }
    }

    componentDidUpdate() {
        if (!_.isEmpty(this.props.user.user)) {
            this.props.history.push(HOME_PATH);
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

Login.propTypes = {
    signIn: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, { signIn })(Login);
