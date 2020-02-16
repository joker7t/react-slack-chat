import React, { Component } from 'react';
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import InvertedSpinner from "../spinner/InvertedSpinner";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Messages extends Component {
    constructor() {
        super();
        this.state = {
            isLoadingChannel: true,
            messageRef: firebase.database().ref('messages')
        };
    }

    componentDidMount() {
        if (this.props.channels) {
            this.setState({ isLoadingChannel: this.props.channels.isLoadingChannel });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.channels) {
            this.setState({ isLoadingChannel: newProps.channels.isLoadingChannel });
        }
    }

    render() {
        return (
            this.state.isLoadingChannel ? <InvertedSpinner /> : <React.Fragment>
                <MessageHeader />

                <Segment>
                    <Comment.Group className="messages">

                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.state.messageRef}
                    user={this.props.user}
                    channel={this.props.channels.selectedChannel}
                />
            </React.Fragment>
        );
    }
}

Messages.propTypes = {
    user: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.users.user,
    channels: state.channels
})

export default connect(mapStateToProps, null)(Messages);
