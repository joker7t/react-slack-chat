import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";
import ColorPanel from './color-panel/ColorPanel';
import SidePanel from './side-panel/SidePanel';
import Messages from './messages/Messages';
import MetaPanel from './meta-panel/MetaPanel';

class Landing extends Component {
    render() {
        return (
            <Grid columns="equal" className="app main-background">

                <ColorPanel />

                <SidePanel />

                <Grid.Column style={{ marginLeft: 320 }}>
                    <Messages />
                </Grid.Column>

                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>

            </Grid>
        );
    }
}

export default Landing;
