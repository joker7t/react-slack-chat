import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setColors } from "../../actions/colorAction";

class ColorPanel extends Component {
    constructor() {
        super();

        this.state = {
            modal: false,
            primary: '',
            secondary: '',
            usersRef: firebase.database().ref("users"),
            userColors: []
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

    displayUserColors = colors => {
        return colors.length > 0 && colors.map((color, i) => (
            <React.Fragment key={i}>
                <Divider />
                <div className="color__container"
                    onClick={() => this.props.setColors(color.primary, color.secondary)}>
                    <div className="color__square" style={{ background: color.primary }}>
                        <div className="color__overlay" style={{ background: color.secondary }}></div>
                    </div>
                </div>
            </React.Fragment>
        ));
    }

    addListener = (uid) => {
        let userColors = []
        this.state.usersRef
            .child(`${uid}/colors`).on("child_added", snap => {
                userColors.unshift(snap.val());
                this.setState({ userColors: userColors });
            });
    }

    componentDidMount() {
        if (this.props.user) {
            this.addListener(this.props.user.uid);
        }
    }

    componentWillUnmount() {
        if (this.props.user) {
            this.state.usersRef.child(`${this.props.user.uid}/colors`).off();
        }
    }

    render() {
        const { modal, primary, secondary, userColors } = this.state;

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
                {this.displayUserColors(userColors)}

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
    user: PropTypes.object.isRequired,
    setColors: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user.user
})

export default connect(mapStateToProps, { setColors })(ColorPanel);