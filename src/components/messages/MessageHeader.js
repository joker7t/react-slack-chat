import React, { Component } from 'react';
import { Header, Input, Segment, Icon } from "semantic-ui-react";

class MessageHeader extends Component {

    getChannelName = (isPrivateChannel) => isPrivateChannel ? '@' : '#'


    render() {
        const { channelName, channelUsers, handleSearchMessageChange,
            searchMessageLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props;

        return (
            <Segment clearing className="message_header">
                {/* Channel title */}
                <div className="message_header-left">
                    <span className='message_header-left-channel'>
                        {`${this.getChannelName(isPrivateChannel)}${channelName} `}
                        {isPrivateChannel ?
                            null :
                            <Icon
                                name={isChannelStarred ? "star" : "star outline"}
                                color={isChannelStarred ? "yellow" : "black"}
                                onClick={handleStar}
                            />}
                    </span>
                    <div className='message_header-left-user'>{channelUsers}</div>
                </div>

                {/* Channel search input */}
                <div className="message_header-right">
                    <Input
                        loading={searchMessageLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search messages"
                        onChange={handleSearchMessageChange}
                    />
                </div>
            </Segment>
        );
    }
}

export default MessageHeader;
