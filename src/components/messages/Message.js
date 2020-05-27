import React, { Component } from 'react';
import { Comment, Image } from "semantic-ui-react";
import classnames from "classnames";
import moment from "moment";

class Message extends Component {
    isOwnMessage = () => this.props.user.uid === this.props.message.user.id;

    timeFromNow = (timestamp) => moment(timestamp).fromNow();

    isImage = message => message.hasOwnProperty('image') && !message.hasOwnProperty('content');

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
                    {this.isImage(message) ?
                        <Image src={message.image} className="message_image" /> :
                        <Comment.Text>{message.content}</Comment.Text>
                    }
                </Comment.Content>
            </Comment>
        );
    }
}

export default Message;
