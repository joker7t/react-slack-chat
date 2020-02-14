import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
    constructor() {
        super();
        this.state = {
            channels: [],
            modal: false,
            channelName: '',
            channelDetails: ''
        };
    }

    handleCloseModal = () => {
        this.setState({ modal: false });
    }

    handleOpenModal = () => {
        this.setState({ modal: true });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { channels, modal, channelName, channelDetails } = this.state;
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
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.handleCloseModal}>
                    <Modal.Header>
                        Add a Channel
                </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.onChange}
                                    value={channelName}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.onChange}
                                    value={channelDetails}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted>
                            <Icon name="checkmark" /> Add
                </Button>
                        <Button color="red" inverted onClick={this.handleCloseModal}>
                            <Icon name="remove" /> Cancel
                </Button>
                    </Modal.Actions>

                </Modal>
            </React.Fragment>
        );
    }
}

export default Channels;
