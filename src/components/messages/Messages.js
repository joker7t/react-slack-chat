import React, { Component } from 'react';
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from './MessageForm';
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
            messages: []
        };
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
        return (
            //Cannot use because of callback from firebase call a lot of times
            // this.state.isLoadingChannel ? <InvertedSpinner /> : 
            <React.Fragment>
                <MessageHeader />

                <Segment>
                    <Comment.Group className="messages">

                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.state.messageRef}
                    user={this.props.user}
                    channel={this.props.channel.selectedChannel}
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
