import React, { Component } from 'react';
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from './MessageForm';
import Message from "./Message";
import MessageHeader from './MessageHeader';
import firebase from "../../firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setStarredChannel } from "../../actions/channelAction";
import { setTopPosters } from "../../actions/topPostAction";
import Typing from "./Typing"
import Skeleton from "./Skeleton";

class Messages extends Component {
    constructor() {
        super();
        this.state = {
            //Cannot use because of callback from firebase call a lot of times
            // isLoadingChannel: true,
            userRef: firebase.database().ref('users'),
            messageRef: firebase.database().ref('messages'),
            privateMessageRef: firebase.database().ref('privateMessages'),
            typingRef: firebase.database().ref('typing'),
            connectedRef: firebase.database().ref('info/connected'),
            messages: [],
            progressBar: false,
            searchMessage: '',
            searchMessageLoading: false,
            searchResult: [],
            starredChannels: [],
            typingUsers: [],
            messagesLoading: true
        };
    }

    getMessageRef = () => this.props.channel.isPrivateChannel ? this.state.privateMessageRef : this.state.messageRef;


    setProgressBar = (isProgressBar) => this.setState({ progressBar: isProgressBar });

    displayMessages = (messages) =>
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ));

    //not work because of loading image
    setDefaultScroll = () => {
        setTimeout(() => {
            const messageContent = document.querySelector('#messageContent');
            if (messageContent !== null) {
                messageContent.scrollTop = messageContent.scrollHeight;

            }
        }, 1);

    }

    getChannelUsers = (messages) => {
        const channelUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.id)) {
                acc.push(message.user.id);
            }
            return acc;
        }, []);
        const plural = channelUsers.length > 1 || channelUsers.length === 0 ? 's' : '';
        return `${channelUsers.length} user${plural}`;
    }

    handleSearchMessageChange = (e) => {
        this.setState({
            searchMessage: e.target.value,
            searchMessageLoading: true
        },
            () => {
                this.handleSearchMessage();
            });
    }

    handleSearchMessage = () => {

        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchMessage, 'gi');
        const searchResult = this.state.searchMessage === '' ?
            channelMessages :
            channelMessages.reduce((acc, message) => {
                if (message.content && message.content.match(regex)) {
                    acc.push(message);
                }
                return acc;
            }, []);
        this.setState({ searchResult: searchResult });
        setTimeout(() => this.setState({ searchMessageLoading: false }), 500);
    }

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel())
    }

    isChannelStarred = (channelId) => this.state.starredChannels
        .map(starredChannel => starredChannel.id).includes(channelId);

    starChannel = () => {
        const { user, channel } = this.props;
        if (!this.isChannelStarred(channel.selectedChannel.id)) {
            const channelVal = {
                name: channel.selectedChannel.name,
                details: channel.selectedChannel.details,
                createdBy: {
                    name: channel.selectedChannel.createdBy.name,
                    avatar: channel.selectedChannel.createdBy.avatar
                }

            }
            this.state.userRef.child(`${user.uid}/starred`).update({
                [channel.selectedChannel.id]: channelVal
            })

            //custom the same for channel in redux
            channelVal['id'] = channel.selectedChannel.id;
            this.setState({
                starredChannels: [...this.state.starredChannels, channelVal]
            }, () => {
                this.props.setStarredChannel(this.state.starredChannels);
            }
            );
        } else {
            this.state.userRef.child(`${user.uid}/starred`)
                .child(channel.selectedChannel.id)
                .remove(err => err && console.log(err));
            this.setState({
                starredChannels: this.state.starredChannels.filter(node => node.id !== channel.selectedChannel.id)
            }, () => {
                this.props.setStarredChannel(this.state.starredChannels);
            });
        }
    }

    addUserStarListener = (userId) => {
        this.state.userRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    this.setState({
                        starredChannels:
                            channelIds.map(channelId => {
                                const starredChannel = data.val()[channelId];
                                starredChannel['id'] = channelId;
                                return starredChannel
                            })
                    }, () => {
                        this.props.setStarredChannel(this.state.starredChannels);
                    });
                }
            })
    }

    setTopPostersListener = (messages) => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    count: 1,
                    avatar: message.user.avatar
                }
            }
            return acc;
        }, {});
        this.props.setTopPosters(userPosts);
    }

    componentDidMount() {
        const { channel, user } = this.props;
        // Cannot use because of callback from firebase call a lot of times
        // if (this.props.channels) {
        //     this.setState({ isLoadingChannel: isLoadingChannel });
        // }

        //not work because channel cannot load on time
        if (channel.selectedChannel.id) {
            let messagesAdded = [];
            this.getMessageRef().child(channel.selectedChannel.id).on("child_added", messageNode => {
                messagesAdded.push(messageNode.val());
                this.setState({ messages: messagesAdded });
                this.setTopPostersListener(messagesAdded);
            });
        }

        if (user) {
            const userId = user.uid ? user.uid : user.user.uid;
            this.addUserStarListener(userId);
        }
    }

    addTypingListener = (channelId, userId) => {
        const { typingRef } = this.state;
        let typingUsers = [];
        typingRef.child(channelId).on('child_added', snap => {
            if (snap.key) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                })
                this.setState({ typingUsers });
            }
        });

        typingRef.child(channelId).on('child_removed', snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);
            if (index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== snap.key);
                this.setState({ typingUsers });
            }
        });

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                typingRef
                    .child(channelId)
                    .child(userId)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.log(err);
                        }
                    })
            }
        })
    }

    displayTypingUser = typingUsers => {
        return typingUsers.map((typingUser, i) => {
            return <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }}>
                <span className="user__typing">{typingUser.name} is typing</span><Typing />
            </div>
        })
    }

    displayMessagesSkeleton = messagesLoading =>
        messagesLoading ? <React.Fragment>
            {[...Array(10)].map((_, i) =>
                <Skeleton key={i} />
            )}
        </React.Fragment> : null


    componentWillReceiveProps(newProps) {
        const messageRef = newProps.channel.isPrivateChannel ? this.state.privateMessageRef : this.state.messageRef;
        const { user } = newProps;
        this.setState({ messages: [] });
        const { selectedChannel } = newProps.channel;
        if (selectedChannel.id) {
            let messagesAdded = [];
            messageRef.child(selectedChannel.id).on("child_added", messageNode => {
                messagesAdded.push(messageNode.val());
                this.setState({ messages: messagesAdded, messagesLoading: false });
                this.setTopPostersListener(messagesAdded);
            });
            const userId = user.uid ? user.uid : user.user.uid;
            this.addTypingListener(selectedChannel.id, userId);
        }

    }

    render() {
        const { messages, searchResult, searchMessage, searchMessageLoading, typingUsers, messagesLoading } = this.state;
        const { channel } = this.props;
        return (
            //Cannot use because of callback from firebase call a lot of times
            // this.state.isLoadingChannel ? <InvertedSpinner /> : 
            <React.Fragment>
                <MessageHeader
                    channelName={channel.selectedChannel.name}
                    channelUsers={this.getChannelUsers(messages)}
                    handleSearchMessageChange={this.handleSearchMessageChange}
                    searchMessageLoading={searchMessageLoading}
                    isPrivateChannel={channel.isPrivateChannel}
                    isChannelStarred={this.isChannelStarred(channel.selectedChannel.id)}
                    handleStar={this.handleStar}
                />

                <Segment>
                    <Comment.Group
                        className={this.state.progressBar ? "messages_progress" : "messages"}
                        id="messageContent"
                    >
                        {this.displayMessagesSkeleton(messagesLoading)}
                        {searchMessage === '' ?
                            this.displayMessages(messages) :
                            this.displayMessages(searchResult)}
                        {this.displayTypingUser(typingUsers)}
                        {this.setDefaultScroll()}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={this.getMessageRef()}
                    user={this.props.user}
                    channel={channel.selectedChannel}
                    setProgressBar={this.setProgressBar}
                    isPrivateChannel={channel.isPrivateChannel}
                />
            </React.Fragment>
        );
    }
}

Messages.propTypes = {
    user: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    setStarredChannel: PropTypes.func.isRequired,
    setTopPosters: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    channel: state.channel,
})

export default connect(mapStateToProps, { setStarredChannel, setTopPosters })(Messages);
