import React from 'react';
import { Loader } from 'semantic-ui-react';

export default () => {
    return (
        <Loader
            active
            inline="centered"
            size="massive"
            style={{ marginTop: '45vh' }}
        />
    );
}
