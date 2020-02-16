import React, { Component } from 'react';
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import BlankMessage from "./BlankMessage";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

class Messages extends Component {
    constructor() {
        super();
        this.state = {
            messageRef: firebase.database().ref('messages')
        };
    }

    render() {
        return (
            _.isEmpty(this.props.channel) ? <BlankMessage /> : <React.Fragment>
                <MessageHeader />

                <Segment>
                    <Comment.Group className="messages">

                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.state.messageRef}
                    user={this.props.user}
                    channel={this.props.channel}
                />
            </React.Fragment>
        );
    }
}

Messages.propTypes = {
    user: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.users.user,
    channel: state.channels.selectedChannel
})

export default connect(mapStateToProps, null)(Messages);
