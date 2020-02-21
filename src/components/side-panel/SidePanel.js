import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

class SidePanel extends Component {
    render() {
        return (
            <Menu
                className="side-pannel"
                style={{ width: 280 }}
                inverted
                fixed="left"
                vertical
            >
                <UserPanel />
                <Starred />
                <Channels />
                <DirectMessages />
            </Menu>
        );
    }
}

export default SidePanel;
