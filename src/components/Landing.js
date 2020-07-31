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
import MessageForm from './messages/MessageForm';
import firebase from "../firebase";

class Landing extends Component {
    constructor() {
        super();

        this.state = {
            visible: false,
            messageRef: firebase.database().ref('messages'),
            privateMessageRef: firebase.database().ref('privateMessages'),
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

    getMessageRef = () => this.props.channel.isPrivateChannel ? this.state.privateMessageRef : this.state.messageRef;


    setProgressBar = (isProgressBar) => this.setState({ progressBar: isProgressBar });

    render() {
        const { channel, user, color } = this.props;

        return (
            <div className="landing">
                <Grid columns={1}>
                    <Grid.Column className='main-header'>
                        <div className='header-name'>
                            <Icon name="code" />Toan's chat
                        </div>
                        <i className="sidebar icon sidebar-icon large" onClick={this.toggleSidebar}></i>
                    </Grid.Column>

                    <Grid.Column style={{ paddingTop: '0' }}>
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

                            <Sidebar.Pusher dimmed={this.state.visible} style={{ height: '100%', minHeight: '0', background: '#eee' }}>
                                <Segment basic>
                                    <Grid columns="equal" style={{ background: color.secondary }} className='sub-landing'>

                                        <Grid.Column className='message-pannel'>
                                            <Messages />
                                        </Grid.Column>

                                        <Grid.Column className='meta-pannel'>
                                            <MetaPanel />
                                        </Grid.Column>
                                    </Grid>

                                    <Grid columns={1} style={{ backgroundColor: '#eee' }}>
                                        <Grid.Column style={{ paddingTop: '0' }}>
                                            <MessageForm
                                                messageRef={this.getMessageRef()}
                                                user={user}
                                                channel={channel.selectedChannel}
                                                setProgressBar={this.setProgressBar}
                                                isPrivateChannel={channel.isPrivateChannel}
                                            />
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
    color: state.color,
    channel: state.channel
});

export default connect(mapStateToProps, null)(Landing);
