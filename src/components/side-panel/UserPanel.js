import React, { Component } from 'react';
import { Grid, GridColumn, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends Component {

    render() {
        const dropDownOptions = [
            {
                key: 'user',
                text: <span>Signed in as <strong>User</strong></span>,
                disable: true
            },
            {
                key: 'avatar',
                text: <span>Change avatar</span>,
            },
            {
                key: 'signout',
                text: <span>Sign out</span>
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

export default UserPanel;
