import React, { Component } from 'react';
import {
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Menu,
    Segment,
    Sidebar,
} from 'semantic-ui-react'
import ColorPanel from './color-panel/ColorPanel';
import SidePanel from './side-panel/SidePanel';
import Messages from './messages/Messages';
import MetaPanel from './meta-panel/MetaPanel';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from 'lodash';
import UserPanel from './side-panel/UserPanel';
import Channels from './side-panel/Channels';
import DirectMessages from './side-panel/DirectMessages';
import Starred from './side-panel/Starred';

let checkSidebar = true;

class Landing extends Component {
    constructor() {
        super();

        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        if (_.isEmpty(this.props.user)) {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(newProps) {
        if (_.isEmpty(newProps.user)) {
            this.props.history.push("/login");
        }
    }

    toggleSidebar = () => {
        this.state.visible ? this.setState({ visible: false }) : this.setState({ visible: true });
    }

    render() {
        const { color } = this.props;

        return (
            <div className="landing">
                <Grid columns={1}>
                    <Grid.Column className='main-header'>
                        <div className='header-name'>
                            <Icon name="code" />Toan's chat
                        </div>
                        <i className="sidebar icon sidebar-icon large" onClick={this.toggleSidebar}></i>
                    </Grid.Column>

                    <Grid.Column>
                        <Sidebar.Pushable as={Segment} className='pushable-container'>
                            <Sidebar
                                as={Menu}
                                animation='overlay'
                                icon='labeled'
                                inverted
                                onHide={() => this.setState({ visible: false })}
                                vertical
                                visible={this.state.visible}
                                width='wide'
                                style={{ background: this.props.color.primary }}
                                direction='right'
                            >
                                <Menu.Item>
                                    <UserPanel />
                                </Menu.Item>
                                <Menu.Item>
                                    <Starred />
                                </Menu.Item>
                                <Menu.Item>
                                    <Channels />
                                </Menu.Item>
                                <Menu.Item>
                                    <DirectMessages />
                                </Menu.Item>
                            </Sidebar>

                            <Sidebar.Pusher dimmed={this.state.visible} style={{ height: '100%', minHeight: '0' }}>
                                <Segment basic>
                                    <Grid columns="equal" style={{ background: color.secondary }} className='sub-landing'>

                                        <Grid.Column>
                                            <Messages />
                                        </Grid.Column>

                                        <Grid.Column>
                                            <MetaPanel />
                                        </Grid.Column>

                                    </Grid>
                                </Segment>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </Grid.Column>
                </Grid>
            </div>

        );
    }
}

Landing.propTypes = {
    user: PropTypes.object.isRequired,
    color: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user.user,
    color: state.color
});

export default connect(mapStateToProps, null)(Landing);
