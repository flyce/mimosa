import React from 'react';
import Header from '../../Layout/Header';
import { Table, Button, message } from "antd/lib/index";
import Demo from '../../Compontent/Demo';

class Scheduling extends React.Component {
    render() {

        return (
            <div>
                <Header />
                    <div style={{ padding: '0 50px',  margin: '16px 0' }}>
                        <Demo/>
                    </div>
            </div>
        );
    }
}

export default Scheduling;