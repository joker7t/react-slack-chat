import React, { Component } from 'react';
import { Row, Col, Alert, Badge, Button, Form } from 'react-bootstrap';
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
                    this.props.signIn(signedInUser);
                    this.setState({ isLoading: false });
                    this.props.history.push(HOME_PATH);

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
            return <Alert variant='danger'>
                <p>{errorMessage.message}</p>
            </Alert>;
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.user.user)) {
            this.props.history.push(HOME_PATH);
        }
    }

    render() {
        return (
            <Row textAlign="center" verticalAlign="middle" className="app">
                <Col className="max-width-grid-column">
                    <h1>
                        <Badge style={{ color: "violet", textAlign: "center" }}>
                            <i class="fa fa-sign-in" aria-hidden="true"></i>
                            Login for chat
                        </Badge>
                    </h1>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="email" placeholder="email address"
                                className={this.isInputFieldHasError('email')}
                                onChange={this.onChange} type="text" value={this.state.email} />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Pass</Form.Label>
                            <Form.Control name="password" placeholder="password"
                                className={this.isInputFieldHasError('password')}
                                onChange={this.onChange} type="password" value={this.state.password} />
                        </Form.Group>

                        <Button disabled={this.state.isLoading}
                            className={this.state.isLoading ? "loading" : "ui button"}
                            style={{ color: "violet" }}
                            block
                            type="submit">
                            Submit
                        </Button>
                    </Form>
                    {this.isShownErrorMessage()}
                    <Alert variant='secondary'>
                        <Link to={REGISTER_PATH}>Sign up</Link>
                    </Alert>
                </Col>
            </Row>
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
