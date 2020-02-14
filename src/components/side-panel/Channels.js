import React, { Component } from 'react';
import { Menu, Icon } from "semantic-ui-react";

class Channels extends Component {
    constructor() {
        super();
        this.state = {
            channels: []
        };
    }
    render() {
        return (
            <Menu.Menu style={{ paddingBottom: "2rem" }}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
            </span>
                    {" "}
                    ({this.state.channels.length}) <Icon name="add" />
                </Menu.Item>
            </Menu.Menu>
        );
    }
}

export default Channels;
