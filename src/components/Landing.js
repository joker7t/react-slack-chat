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
        return (
            <Grid columns="equal" className="app main-background">

                <ColorPanel />

                <SidePanel />

                <Grid.Column style={{ marginLeft: 320 }}>
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
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.users.user
});

export default connect(mapStateToProps, null)(Landing);
