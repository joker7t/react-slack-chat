import React, { Component } from 'react';
import { Segment, Button, Input } from "semantic-ui-react";
import _ from "lodash";

class MessageForm extends Component {
    constructor() {
        super();

        this.state = {
            message: {},
            isLoading: false
        };
    }

    sendMessage = () => {
        const { channel, user, channelRef } = this.props;
        const { message } = this.state;
    }

    render() {
        return (
            <Segment className="message_form">
                <Input
                    fluid
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write you message"
                />

                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={() => this.sendMessage()}
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
