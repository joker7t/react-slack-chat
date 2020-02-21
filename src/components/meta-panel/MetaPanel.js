import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon } from "semantic-ui-react";
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

    componentDidMount() {
        console.log(this.props.user);
        console.log(this.props.channel);
    }

    componentDidUpdate() {
        console.log(this.props.user);
        console.log(this.props.channel);
    }



    render() {
        const { activeIndex } = this.state;
        const { user, channel } = this.props;
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
                        details
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
                        Created by {user.displayName}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        creator
                    </Accordion.Content>
                </Accordion>

            </Segment>
        );
    }
}

MetaPanel.propTypes = {
    user: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    channel: state.channel,
})

export default connect(mapStateToProps, null)(MetaPanel);
