import React from 'react';
import Header from '../../Layout/Header';
import PeopleList from '../../Compontent/PeopleList';

class Scheduling extends React.Component {
    render() {

        return (
            <div>
                <Header />
                    <div className="content">
                        <PeopleList/>
                    </div>
            </div>
        );
    }
}

export default Scheduling;