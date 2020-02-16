import React, { Component } from 'react';
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import _ from "lodash";
import FileModal from "./FileModal";

class MessageForm extends Component {
    constructor() {
        super();

        this.state = {
            message: '',
            isLoading: false,
            isMessageHasError: false,
            modal: false
        };
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    createMessage = () => {
        const { user } = this.props;
        const { message } = this.state;
        const messageObj = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            },
            content: message
        }
        console.log(messageObj);
        return messageObj;
    }

    sendMessage = async () => {
        const { channel, messageRef } = this.props;
        const { message } = this.state;

        if (message) {
            this.setState({ isLoading: true });
            try {
                await messageRef
                    .child(channel.id)
                    .push()
                    .set(this.createMessage());

            } catch (error) {
                this.setState({ isMessageHasError: true });
                console.log(error);
            }
            this.setState({ isLoading: false, message: '' });
        } else {
            this.setState({ isLoading: false, isMessageHasError: true });
        }
    }

    isDisabledButton = () => _.isEmpty(this.props.channel) || this.state.isLoading;

    render() {
        return (
            <Segment className="message_form">
                <Input
                    fluid
                    className={classnames("input-add-channel", {
                        "error": this.state.isMessageHasError
                    })}
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write you message"
                    value={this.state.message}
                    onChange={this.onChange}
                />

                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        disabled={this.isDisabledButton()}
                        onClick={() => this.sendMessage()}
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        disabled={this.isDisabledButton()}
                        onClick={this.openModal}
                    />
                    <FileModal
                        modal={this.state.modal}
                        closeModal={this.closeModal}
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
