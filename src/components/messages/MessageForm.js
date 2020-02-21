import React, { Component } from 'react';
import { Segment, Button, Input, Form } from "semantic-ui-react";
import firebase from "../../firebase";
import classnames from "classnames";
import _ from "lodash";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from './ProgressBar';

class MessageForm extends Component {
    constructor() {
        super();

        this.state = {
            message: '',
            isLoading: false,
            isMessageHasError: false,
            modal: false,
            file: null,
            isModalHasError: false,
            //properties for upload file
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: '',
            percentageUploaded: 0,
            errors: []
        };
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false, file: null, isModalHasError: false });

    setFile = (file) => this.setState({ file: file });

    setIsModalHasError = (isModalHasError) => this.setState({ isModalHasError: isModalHasError });

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    createMessage = (downloadURL = null) => {
        const { user } = this.props;
        const { message } = this.state;
        const messageObj = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL
            },
        }
        if (downloadURL !== null) {
            messageObj['image'] = downloadURL;
        } else {
            messageObj['content'] = message;
        }
        return messageObj;
    }

    sendMessage = async (e) => {
        e.preventDefault();
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
            this.setState({ isLoading: false, message: '', isMessageHasError: false });
        } else {
            this.setState({ isLoading: false, isMessageHasError: true });
        }
    }

    getFilePath = (isPrivateChannel, channel) =>
        isPrivateChannel ? `chat/private-${channel.id}/${uuidv4()}.jpg` : `chat/public/${uuidv4()}.jpg`


    uploadFile = (file, metadata) => {
        const { channel, messageRef, setProgressBar, isPrivateChannel } = this.props;
        const { storageRef } = this.state;

        const pathToUpload = channel.id;
        const filePath = this.getFilePath(isPrivateChannel, channel);

        setProgressBar(true);
        this.setState(
            {
                uploadState: 'uploading',
                uploadTask: storageRef.child(filePath).put(file, metadata),
                isMessageHasError: false
            },
            //this block needs to use callback because it need to use this NEW state imediately
            () => {
                this.state.uploadTask.on('state_changed',
                    snap => {
                        const percentageUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentageUploaded: percentageUploaded });
                    },
                    error => {
                        this.handleError(error)
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                            this.sendFileMessage(downloadURL, messageRef, pathToUpload);
                        }).catch(error => {
                            this.handleError(error);
                        })
                    }
                )
            }
        )
    }

    sendFileMessage = (downloadURL, messageRef, pathToUpload) => {
        messageRef.child(pathToUpload)
            .push()
            .set(this.createMessage(downloadURL))
            .then(() => {
                this.setState({ uploadState: 'done' });
                this.props.setProgressBar(false);
            }).catch(error => {
                console.error(error);
                this.setState({
                    errors: this.state.errors.concat(error)
                });
            })
    }

    handleError = (error) => {
        console.log(error);
        this.setState({
            errors: this.state.errors.concat(error),
            uploadState: 'error',
            uploadTask: null
        });
        this.props.setProgressBar(false);
    }

    isDisabledButton = () => _.isEmpty(this.props.channel) || this.state.isLoading;

    render() {
        return (
            <Segment className="message_form">
                <Form onSubmit={this.sendMessage}>
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
                            onClick={this.sendMessage}
                        />
                        <Button
                            color="teal"
                            content="Upload Media"
                            labelPosition="right"
                            icon="cloud upload"
                            disabled={this.isDisabledButton() || this.state.uploadState === 'uploading'}
                            onClick={this.openModal}
                        />
                    </Button.Group>

                </Form>
                <ProgressBar
                    uploadState={this.state.uploadState}
                    percentageUploaded={this.state.percentageUploaded}
                />
                <FileModal
                    modal={this.state.modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                    file={this.state.file}
                    isModalHasError={this.state.isModalHasError}
                    setFile={this.setFile}
                    setIsModalHasError={this.setIsModalHasError}
                />
            </Segment>
        );
    }
}

export default MessageForm;
