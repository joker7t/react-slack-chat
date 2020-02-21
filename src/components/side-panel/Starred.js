import React, { Component } from 'react';
import { Menu, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions/channelAction";

class Starred extends Component {
    constructor() {
        super();

        this.state = {
            starredChannel: [],
            activeChannel: ''
        }
    }

    onCLickForChannel = (channel) => {
        this.props.setCurrentChannel(channel);
    }

    isChannelActive = (channel) => this.props.channel.selectedChannel.id === channel.id;

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.onCLickForChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={this.isChannelActive(channel)}
            >
                # {channel.name}
            </Menu.Item>
        ))
    }

    render() {
        const { starredChannel } = this.state;

        return (
            <Menu.Menu style={{ paddingBottom: "2rem" }}>
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                        </span>
                    {" "}
                    ({starredChannel.length})
                </Menu.Item>

                {this.displayChannels(starredChannel)}
            </Menu.Menu>
        );
    }
}

Starred.propTypes = {
    channel: PropTypes.object.isRequired,
    setCurrentChannel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    channel: state.channel
});

export default connect(mapStateToProps, { setCurrentChannel })(Starred);