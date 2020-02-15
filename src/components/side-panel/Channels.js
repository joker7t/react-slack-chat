import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Message } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../Spinner";
import { geAllChannels, addChannel } from "../../actions/channelAction";

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
        const key = channelRef.push().key;
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
        try {
            await channelRef.child(key).update(newChannel);
            this.props.addChannel(newChannel);
            this.setState({ channelName: '', channelDetails: '' });
            this.handleCloseModal();
            console.log(newChannel);
        } catch (error) {
            this.setState({ isInValid: false });
            console.log(error);
        }
        this.setState({ isLoading: false });
    }

    isShownErrorMessage = () => {
        if (this.state.isInValid) {
            return <Message error>
                <p>Cannot create channel</p>
            </Message>;
        }
    }

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => console.log(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
            >
                # {channel.name}
            </Menu.Item>
        ))
    }

    componentDidMount() {
        console.log("didmount channel");
        // example 
        // this.props.geAllChannels();
    }

    componentWillReceiveProps(newProps) {
        this.setState({ channels: newProps.channels.channels });
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

                    {this.displayChannels(this.props.channels.channels)}
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
    user: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired,
    geAllChannels: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.users.user,
    channels: state.channels
});

export default connect(mapStateToProps, { geAllChannels, addChannel })(Channels);