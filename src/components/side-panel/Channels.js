import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Message } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../Spinner";
import { getAllChannels, setCurrentChannel } from "../../actions/channelAction";

class Channels extends Component {
    constructor() {
        super();
        this.state = {
            channelRef: firebase.database().ref('channels'),
            channels: [],
            modal: false,
            channelName: '',
            channelDetails: '',
            isLoading: false,
            isInValid: false,
            isFirstload: true
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
        const key = this.state.channelRef.push().key;
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
            await this.state.channelRef.child(key).update(newChannel);
            this.setState({
                channelName: '',
                channelDetails: ''
            });
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

    isChannelActive = (channel) => this.props.channels.selectedChannel.id === channel.id;

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.onCLickForChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={this.isChannelActive(channel)}
            >
                # {channel.name}
            </Menu.Item>
        ))
    }

    onCLickForChannel = (channel) => {
        this.props.setCurrentChannel(channel);
    }

    setDefaultChannel = () => {
        const { isFirstload, channels } = this.state;
        if (isFirstload && channels.length > 0) {
            this.props.setCurrentChannel(channels[0]);
        }
        this.setState({ isFirstload: false });
    }

    componentDidMount() {
        let channelsAdded = [];
        firebase.database().ref('channels').on("child_added", channelNode => {
            channelsAdded.push(channelNode.val());
            this.props.getAllChannels(channelsAdded);
            this.setDefaultChannel();
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ channels: newProps.channels.channels });
    }

    componentWillUnmount() {
        this.state.channelRef.off();
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

                    {this.displayChannels(channels)}
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
                                    className={classnames("input-add-channel", {
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
                                    className={classnames("input-add-channel", {
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
    getAllChannels: PropTypes.func.isRequired,
    setCurrentChannel: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.users.user,
    channels: state.channels
});

export default connect(mapStateToProps, { getAllChannels, setCurrentChannel })(Channels);