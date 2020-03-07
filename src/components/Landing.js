import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";
import ColorPanel from './color-panel/ColorPanel';
import SidePanel from './side-panel/SidePanel';
import Messages from './messages/Messages';
import MetaPanel from './meta-panel/MetaPanel';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from 'lodash';

class Landing extends Component {
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

    render() {
        const { color } = this.props;

        return (
            <Grid columns="equal" className="app" style={{ background: color.secondary }}>

                <ColorPanel />

                <SidePanel />

                <Grid.Column style={{ marginLeft: 350 }}>
                    <Messages />
                </Grid.Column>

                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>

            </Grid>
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
