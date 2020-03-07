import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ColorPanel extends Component {
    constructor() {
        super();

        this.state = {
            modal: false,
            primary: '',
            secondary: '',
            usersRef: firebase.database().ref("users")
        }
    }

    handleChangePrimary = (color) => this.setState({ primary: color.hex });

    handleChangeSecondary = (color) => this.setState({ secondary: color.hex });

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleSaveColors = () => {
        const { primary, secondary } = this.state;
        if (primary && secondary) {
            this.saveColors(primary, secondary);
        }
    }

    saveColors = (primary, secondary) => {
        const { uid } = this.props.user;
        this.state.usersRef
            .child(`${uid}/colors`)
            .push()
            .update({
                primary, secondary
            })
            .then(() => {
                console.log("Color added");
                this.closeModal();
            })
            .catch(err => {
                console.log(err);
            })

    }

    render() {
        const { modal, primary, secondary } = this.state;

        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button icon="add" size="small" color="blue" onClick={this.openModal} />

                {/*Color picker modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <SliderPicker color={primary} onChange={this.handleChangePrimary} />
                        </Segment>

                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondary} />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSaveColors}>
                            <Icon name="checkmark" />Save Color
                        </Button>

                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" />Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

ColorPanel.propTypes = {
    user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user.user,
})

export default connect(mapStateToProps, null)(ColorPanel);