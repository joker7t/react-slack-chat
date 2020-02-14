import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { signOut } from "../../actions/userAction";

class UserPanel extends Component {

    onSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("signed out");
                this.props.signOut();
            });
    }

    render() {
        const { user } = this.props.users;

        const dropDownOptions = [
            {
                key: 'user',
                text: <span>Signed in as <strong>{user.displayName}</strong></span>,
                disabled: true
            },
            {
                key: 'avatar',
                text: <span>Change avatar</span>,
            },
            {
                key: 'signout',
                text: <span onClick={() => this.onSignOut()}>Sign out</span>
            }
        ];

        return (
            <Grid style={{ background: "#4c3c4c" }}>
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
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>}
                                options={dropDownOptions} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid >
        );
    }
}

UserPanel.propTypes = {
    signOut: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    users: state.users
});

export default connect(mapStateToProps, { signOut })(UserPanel);
