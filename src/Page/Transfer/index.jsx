import React from 'react';
import Header from '../../Layout/Header';
import Work from '../../Compontent/Work';

class Transfer extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div style={{ padding: '0 50px',  margin: '16px 0' }}>
                    <Work />
                </div>
            </div>
        );
    }
}


export default Transfer;