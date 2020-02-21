import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Message, Label } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../spinner/Spinner";
import { setCurrentChannel, setIsLoadingChannel } from "../../actions/channelAction";

class Channels extends Component {
    constructor() {
        super();
        this.state = {
            channelRef: firebase.database().ref('channels'),
            messageRef: firebase.database().ref('messages'),
            channels: [],
            modal: false,
            channelName: '',
            channelDetails: '',
            isLoading: false,
            isInValid: false,
            isFirstload: true,
            notifications: []
        };
    }

    handleCloseModal = () => this.setState({ modal: false, isInValid: false, channelName: '', channelDetails: '' });

    handleOpenModal = () => this.setState({ modal: true });

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
            createdBy: {
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
            this.props.setCurrentChannel(newChannel);
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

    isChannelActive = (channel) => this.props.channel.selectedChannel.id === channel.id;

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.onCLickForChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={this.isChannelActive(channel)}
            >
                {this.getNotificationCount(channel) &&
                    <Label color='red'>
                        {this.getNotificationCount(channel)}
                    </Label>
                }
                # {channel.name}
            </Menu.Item>
        ))
    }

    getNotificationCount = (channel) => {
        let count = 0;
        this.state.notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count;
            }
        })
        if (count > 0) return count;
    }

    onCLickForChannel = (channel) => {
        this.props.setCurrentChannel(channel);
        this.clearNotification(channel);
    }

    clearNotification = (channel) => {
        let index = this.state.notifications
            .findIndex(notification => notification.id === channel.id);
        if (index !== -1) {
            let updateNotification = [...this.state.notifications];
            updateNotification[index].lastTotal = this.state.notifications[index].lastKnownTotal;
            updateNotification[index].count = 0;
            this.setState({ notifications: updateNotification });
        }
    }

    setDefaultChannel = () => {
        const { isFirstload, channels } = this.state;
        if (isFirstload && channels.length > 0) {
            this.props.setCurrentChannel(channels[0]);
        }
        this.setState({ isFirstload: false });
    }

    addNotificationListener = channelId => {
        this.state.messageRef.child(channelId).on('value', snap => {
            if (this.props.channel.selectedChannel) {
                this.handleNotification(channelId, this.props.channel.selectedChannel.id, this.state.notifications, snap);
            }
        })
    }

    handleNotification = (channelId, selectedChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== selectedChannelId) {
                lastTotal = notifications[index].total;
                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            } else {
                notifications[index].count = 0;
                notifications[index].total = snap.numChildren();
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        this.setState({ notifications });
    }

    componentDidMount() {
        let channelsAdded = [];
        this.state.channelRef.on("child_added", channelNode => {
            channelsAdded.push(channelNode.val());
            this.setState({ channels: channelsAdded });
            this.setDefaultChannel();
            this.addNotificationListener(channelNode.key);
            //should be check, but not work with callback
            this.props.setIsLoadingChannel(false);
        });
        this.props.setIsLoadingChannel(false);
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
    channel: PropTypes.object.isRequired,
    setCurrentChannel: PropTypes.func.isRequired,
    setIsLoadingChannel: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    channel: state.channel
});

export default connect(mapStateToProps, { setCurrentChannel, setIsLoadingChannel })(Channels);