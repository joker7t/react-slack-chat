import React, { Component } from 'react';
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from './MessageForm';
import Message from "./Message";
import MessageHeader from './MessageHeader';
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Messages extends Component {
    constructor() {
        super();
        this.state = {
            //Cannot use because of callback from firebase call a lot of times
            // isLoadingChannel: true,
            messageRef: firebase.database().ref('messages'),
            messages: [],
            progressBar: false
        };
    }

    setProgressBar = (isProgressBar) => this.setState({ progressBar: isProgressBar });

    displayMessages = (messages) =>
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ));

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //not work because of loading image
    setDefaultScroll = () => {
        const messageContent = document.querySelector('#messageContent');
        if (messageContent !== null) {
            messageContent.scrollTop = messageContent.scrollHeight;

        }
    }

    getChannelUsers = (messages) => {
        const channelUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.id)) {
                acc.push(message.user.id);
            }
            return acc;
        }, []);
        const plural = channelUsers.length > 1 || channelUsers.length === 0 ? 's' : '';
        return `${channelUsers.length} user${plural}`;
    }

    componentDidMount() {
        const { channel } = this.props;
        // Cannot use because of callback from firebase call a lot of times
        // if (this.props.channels) {
        //     this.setState({ isLoadingChannel: isLoadingChannel });
        // }
        if (channel.id) {
            let messagesAdded = [];
            this.state.messageRef.child(channel.id).on("child_added", messageNode => {
                messagesAdded.push(messageNode.val());
                this.setState({ messages: messagesAdded });
            });
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ messages: [] });
        const { selectedChannel } = newProps.channel;
        if (selectedChannel.id) {
            let messagesAdded = [];
            this.state.messageRef.child(selectedChannel.id).on("child_added", messageNode => {
                messagesAdded.push(messageNode.val());
                this.setState({ messages: messagesAdded });
            });
        }
    }

    render() {
        const { messages } = this.state;
        const { selectedChannel } = this.props.channel;
        return (
            //Cannot use because of callback from firebase call a lot of times
            // this.state.isLoadingChannel ? <InvertedSpinner /> : 
            <React.Fragment>
                <MessageHeader
                    channelName={selectedChannel.name}
                    channelUsers={this.getChannelUsers(messages)}
                />

                <Segment>
                    <Comment.Group
                        className={this.state.progressBar ? "messages_progress" : "messages"}
                        id="messageContent"
                    >
                        {this.displayMessages(messages)}
                        {this.setDefaultScroll()}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.state.messageRef}
                    user={this.props.user}
                    channel={this.props.channel.selectedChannel}
                    setProgressBar={this.setProgressBar}
                />
            </React.Fragment>
        );
    }
}

Messages.propTypes = {
    user: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    channel: state.channel,
})

export default connect(mapStateToProps, null)(Messages);
