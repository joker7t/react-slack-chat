import React, { Component } from 'react';
import { Comment } from "semantic-ui-react";
import classnames from "classnames";
import moment from "moment";

class Message extends Component {
    isOwnMessage = () => this.props.user.uid === this.props.message.user.id;

    timeFromNow = (timestamp) => moment(timestamp).fromNow();

    render() {
        const { message } = this.props;
        return (
            <Comment>
                <Comment.Avatar src={message.user.avatar} />
                <Comment.Content
                    className={classnames("", {
                        "message_self": this.isOwnMessage(),
                        "message": !this.isOwnMessage()
                    })}
                >
                    <Comment.Author as="a">{message.user.name}</Comment.Author>
                    <Comment.Metadata>{this.timeFromNow(message.timestamp)}</Comment.Metadata>
                    <Comment.Text>{message.content}</Comment.Text>
                </Comment.Content>
            </Comment>
        );
    }
}

export default Message;
