import React, { Component } from 'react';
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends Component {
    constructor() {
        super();

        this.state = {
            file: null,
            authorized: ['image/jpeg', 'image/png']
        };
    }

    addFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ file: file });
        }
    }

    sendFile = () => {
        const { file } = this.state;
        const { uploadFile, closeModal } = this.props;
        if (file !== null && this.isAuthorized(file)) {
            const metadata = { contentType: mime.lookup(file.name) };
            uploadFile(file, metadata);
            closeModal();
            this.clearFile();
        }
    }

    isAuthorized = (file) => this.state.authorized.includes(mime.lookup(file.name));

    clearFile = () => this.setState({ file: null });

    render() {
        const { modal, closeModal } = this.props;
        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image file</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        label="File types: jpg, png"
                        name="file"
                        type="file"
                        onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        inverted
                        onClick={this.sendFile}
                    >
                        <Icon name="checkmark" /> Send
                    </Button>

                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;
