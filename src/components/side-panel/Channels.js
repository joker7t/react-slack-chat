import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Message } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../Spinner";

class Channels extends Component {
    constructor() {
        super();
        this.state = {
            channels: [],
            modal: false,
            channelName: '',
            channelDetails: '',
            isLoading: false,
            isInValid: false
        };
    }

    handleCloseModal = () => {
        this.setState({ modal: false, isInValid: false });
    }

    handleOpenModal = () => {
        this.setState({ modal: true });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ isInValid: false });
            this.saveChannel();
        } else {
            this.setState({ isInValid: true });
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    saveChannel = async () => {
        this.setState({ isLoading: true });
        const channelRef = firebase.database().ref('channels');
        const key = channelRef.push();
        const { channelName, channelDetails } = this.state;
        const { displayName, photoURL } = this.props.user;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createBy: {
                name: displayName,
                avatar: photoURL
            }
        };

        // .child(createdUser.user.uid).set({
        //     name: createdUser.user.displayName,
        //     avatar: createdUser.user.photoURL
        // });
        this.setState({ isLoading: false });
    }

    isShownErrorMessage = () => {
        if (this.state.isInValid) {
            return <Message error>
                <p>Please fullfill all the channal data</p>
            </Message>;
        }
    }

    render() {
        const { channels, modal, channelName, channelDetails, isInValid, isLoading } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: "2rem" }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>
                        {" "}
                        ({channels.length}) <Icon name="add" style={{ cursor: "pointer" }} onClick={this.handleOpenModal} />
                    </Menu.Item>
                </Menu.Menu>


                <Modal basic open={modal} onClose={this.handleCloseModal}>
                    {isLoading ? <Spinner /> : ''}
                    <Modal.Header>
                        Add a Channel
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    className={classnames("", {
                                        "error": isInValid
                                    })}
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.onChange}
                                    value={channelName}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    className={classnames("", {
                                        "error": isInValid
                                    })}
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.onChange}
                                    value={channelDetails}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.onSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.handleCloseModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                    {this.isShownErrorMessage()}
                </Modal>
            </React.Fragment>
        );
    }
}

Channels.propTypes = {
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.users.user
});

export default connect(mapStateToProps, null)(Channels);