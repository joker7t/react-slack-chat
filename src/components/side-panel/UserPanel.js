import React, { Component } from 'react';
import { Grid, GridColumn, Header, Icon, Dropdown } from "semantic-ui-react";
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
        const dropDownOptions = [
            {
                key: 'user',
                text: <span>Signed in as <strong>User</strong></span>,
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
                <GridColumn>
                    <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>Toan's chat</Header.Content>
                        </Header>
                    </Grid.Row>

                    <Header style={{ padding: ".25rem" }} as="h4" inverted>
                        <Dropdown trigger={<span>User</span>} options={dropDownOptions} />
                    </Header>
                </GridColumn>
            </Grid>
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
