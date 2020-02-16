import React from 'react';
import { Loader, Dimmer } from "semantic-ui-react";

const InvertedSpinner = () => {
    return (
        <Dimmer active inverted>
            <Loader size='huge' content='Loading chat...' />
        </Dimmer>
    );
}

export default InvertedSpinner;
