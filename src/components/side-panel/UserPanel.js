import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { signOut } from "../../actions/userAction";
import AvatarEditor from "react-avatar-editor";

class UserPanel extends Component {

    constructor() {
        super();

        this.state = {
            modal: false,
            previewImage: '',
            croppedImage: '',
            blob: '',
            storageRef: firebase.storage().ref(),
            userRef: firebase.database().ref('users'),
            metadata: {
                contentType: 'image/jpeg'
            },
            uploadCroppedImage: ''
        }
    }

    onSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("signed out");
                this.props.signOut();
            });
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChangeAvatar = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                console.log(reader.result);
                this.setState({ previewImage: reader.result });
            });
        }
    }

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                });
            });
        }
    }

    changeAvatar = () => {
        const { userRef, uploadCroppedImage } = this.state;
        const { user } = this.props;

        firebase.auth().currentUser
            .updateProfile({
                photoURL: uploadCroppedImage
            })
            .then(() => {
                console.log("PhotoURL uploaded");
            })
            .catch(err => {
                console.log(err);
            })
            ;
        userRef
            .child(user.user.uid)
            .update({ avatar: uploadCroppedImage })
            .then(() => {
                console.log("User avatar uploaded");
                this.closeModal();
            })
            .catch(err => {
                console.log(err);
            })
            ;
    }

    handleSaveAvatar = () => {
        const { storageRef, metadata, blob } = this.state;
        const { user } = this.props;

        storageRef
            .child(`avatars/user-${user.user.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadLink => {
                    this.setState({ uploadCroppedImage: downloadLink }, () => {
                        this.changeAvatar();
                    });
                })
            })
    }

    render() {
        const { modal, previewImage, croppedImage } = this.state;
        const { user } = this.props.user;

        const dropDownOptions = [
            {
                key: 'user',
                text: <span>Signed in as <strong>{user && user.displayName}</strong></span>,
                disabled: true
            },
            {
                key: 'avatar',
                text: <span onClick={this.openModal}>Change avatar</span>,
            },
            {
                key: 'signout',
                text: <span onClick={() => this.onSignOut()}>Sign out</span>
            }
        ];

        return (
            <Grid>
                {
                    // colunm contains row because of parent element in vertical order
                }
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>Toan's chat</Header.Content>
                        </Header>

                        <Header style={{ padding: ".25rem" }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user && user.photoURL} spaced="right" avatar />
                                    {user && user.displayName}
                                </span>}
                                options={dropDownOptions} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>

                {/* Change user avatar modal */}
                <Modal open={modal} onClose={this.closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                    <Modal.Content>
                        <Input
                            fluid
                            type="file"
                            label="New Avatar"
                            name="previewImage"
                            onChange={this.handleChangeAvatar}
                        />
                        <Grid centered stackable columns={2}>
                            <Grid.Row centered>
                                <Grid.Column className="ui center aligned grid">
                                    {previewImage &&
                                        <AvatarEditor
                                            ref={node => (this.avatarEditor = node)}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}
                                        />
                                    }
                                </Grid.Column>

                                <Grid.Column>
                                    {croppedImage &&
                                        <Image
                                            style={{ margin: '3.5em auto' }}
                                            width={100}
                                            height={100}
                                            src={croppedImage}
                                        />
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        {croppedImage && <Button color="green" inverted onClick={this.handleSaveAvatar}>
                            <Icon name="save" />Change Avatar
                        </Button>}

                        <Button color="green" inverted onClick={this.handleCropImage}>
                            <Icon name="image" />Preview
                        </Button>

                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" />Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>

            </Grid>
        );
    }
}

UserPanel.propTypes = {
    signOut: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { signOut })(UserPanel);
