import React, { Component } from 'react';
import { Header, Input, Segment, Icon } from "semantic-ui-react";

class MessageHeader extends Component {
    render() {
        const { channelName, channelUsers } = this.props;
        return (
            <Segment clearing className="message_header">
                {/* Channel title */}
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {`${channelName} `}
                        <Icon name="star outline" color="black" />
                    </span>
                    <Header.Subheader>{channelUsers}</Header.Subheader>
                </Header>

                {/* Channel search input */}
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search messages"
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessageHeader;
