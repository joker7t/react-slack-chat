import React, { Component } from 'react';
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setPrivateChannel, setCurrentChannel } from "../../actions/channelAction";

class DirectMessages extends Component {
    constructor() {
        super();

        this.state = {
            user: {},
            users: [],
            usersRef: firebase.database().ref('users'),
            connectedRef: firebase.database().ref('.info/connected'),
            presenceRef: firebase.database().ref('presence')
        }
    }

    addListenner = (userId) => {
        let loadedUsers = [];
        this.state.usersRef.on("child_added", snap => {
            if (userId !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(userId);
                ref.set(true);
                ref.onDisconnect().remove(err => err && console.log(err));
            }
        });

        this.state.presenceRef.on('child_added', snap => {
            if (userId !== snap.key) {
                this.addStatusToUser(snap.key);
            }
        });

        this.state.presenceRef.on('child_removed', snap => {
            if (userId !== snap.key) {
                this.addStatusToUser(snap.key, false);
            }
        });
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (userId === user.uid) {
                user['status'] = connected ? 'online' : 'offline';
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers });
    }

    isUserOnline = (user) => user.status === 'online';

    changePrivateChannel = (user) => {
        const channelId = this.getPrivateChannelId(user.uid);
        const privateChannel = {
            id: channelId,
            name: user.name
        }
        this.props.setCurrentChannel(privateChannel);
        this.props.setPrivateChannel(true);
    }

    getPrivateChannelId = (userId) =>
        (userId < this.state.user.uid) ? `${userId}/${this.state.user.uid}` : `${this.state.user.uid}/${userId}`


    componentDidMount() {
        this.setState({
            user: this.props.user
        }, () => {
            if (this.state.user) {
                this.addListenner(this.state.user.user ? this.state.user.user.uid : this.state.user.uid);
            }
        })
    }

    componentWillUnmount() {
        this.state.usersRef.off();
        this.state.connectedRef.off();
        this.state.presenceRef.off();
    }

    render() {
        const { users } = this.state;
        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name='mail' /> DIRECT MESSAGES
                    </span>
                    {' '}
                    ({users.length})
                </Menu.Item>

                {users.map(user => (
                    <Menu.Item
                        key={user.uid}
                        onClick={() => this.changePrivateChannel(user)}
                        style={{ opacitiy: 0.7, fontStyle: 'italic' }}
                    >
                        <Icon
                            name='circle'
                            color={this.isUserOnline(user) ? 'green' : 'grey'}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

DirectMessages.propTypes = {
    user: PropTypes.object.isRequired,
    setPrivateChannel: PropTypes.func.isRequired,
    setCurrentChannel: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user
})

export default connect(mapStateToProps, { setPrivateChannel, setCurrentChannel })(DirectMessages);
