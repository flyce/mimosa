import React from 'react';
import Header from '../../Layout/Header';
import Manage from '../../Compontent/Manage';

const PeopleManage = () => {
    return (
        <div>
            <Header />
            <div style={{ padding: '0 50px',  margin: '16px 0' }}>
                <Manage/>
            </div>
        </div>
    );
};

export default PeopleManage;