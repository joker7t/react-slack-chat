import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image, List } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class MetaPanel extends Component {
    constructor() {
        super();

        this.state = {
            activeIndex: 0
        }
    }

    setActiveIndex = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    }

    displayCreator = (createdBy) => !createdBy ? null :
        <Header as='h3'>
            <Image circular src={createdBy.avatar} />
            {createdBy.name}
        </Header>;

    displayPost = (count) => count === 0 || count > 1 ? 'posts' : 'post';

    displayTopPosts = (topPost) => {
        Object.entries(topPost)
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) =>
                <List.Item key={i}>
                    <Image avatar src={val.avatar} />
                    <List.Content>
                        <List.Header as='a'>{key}</List.Header>
                        <List.Description>{val.count} {this.displayPost(val.count)}</List.Description>
                    </List.Content>
                </List.Item>
            ).slice(0, 5);
    }

    render() {
        const { activeIndex } = this.state;
        const { channel, topPost } = this.props;

        return channel.isPrivateChannel ? null : (
            <Segment>
                <Header as='h3' attached='top'>
                    About {channel.isPrivateChannel ? "@" : "#"}{channel.selectedChannel.name}
                </Header>
                <Accordion styled attached='true'>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name='info' />
                        Channel Details
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        {channel.selectedChannel.details}
                    </Accordion.Content>
                </Accordion>

                <Accordion styled attached='true'>
                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name='user' />
                        Top Posters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        {this.displayTopPosts(topPost)}
                    </Accordion.Content>
                </Accordion>

                <Accordion styled attached='true'>
                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.setActiveIndex}
                    >
                        <Icon name='dropdown' />
                        <Icon name='pencil alternate' />
                        Created by
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <List>
                            {this.displayCreator(channel.selectedChannel.createdBy)}
                        </List>
                    </Accordion.Content>
                </Accordion>

            </Segment>
        );
    }
}

MetaPanel.propTypes = {
    channel: PropTypes.object.isRequired,
    topPost: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    channel: state.channel,
    topPost: state.topPost
})

export default connect(mapStateToProps, null)(MetaPanel);
