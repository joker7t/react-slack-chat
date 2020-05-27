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
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {`${this.getChannelName(isPrivateChannel)}${channelName} `}
                        {isPrivateChannel ?
                            null :
                            <Icon
                                name={isChannelStarred ? "star" : "star outline"}
                                color={isChannelStarred ? "yellow" : "black"}
                                onClick={handleStar}
                            />}
                    </span>
                    <Header.Subheader>{channelUsers}</Header.Subheader>
                </Header>

                {/* Channel search input */}
                <Header floated="right">
                    <Input
                        loading={searchMessageLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search messages"
                        onChange={handleSearchMessageChange}
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessageHeader;
