import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SidePanel extends Component {
    render() {
        return (
            <Menu
                style={{ width: 280, background: this.props.color.primary }}
                className="side-pannel"
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

SidePanel.propTypes = {
    color: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    color: state.color
});

export default connect(mapStateToProps, null)(SidePanel);