import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";
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

    render() {
        const { activeIndex } = this.state;
        const { channel } = this.props;

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
                        posters
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
                        {this.displayCreator(channel.selectedChannel.createdBy)}
                    </Accordion.Content>
                </Accordion>

            </Segment>
        );
    }
}

MetaPanel.propTypes = {
    channel: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    channel: state.channel
})

export default connect(mapStateToProps, null)(MetaPanel);
