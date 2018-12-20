import React from 'react';

import { Transfer } from 'antd';
import {get} from "../../Utils/fetch";

class PeopleSelector extends React.Component {
    state = {
        targetKeys: [],
        people: [],
        release: [],
        technician: [],
        mechanic: [],
        attendant: [],
        trainees: []
    };

    componentDidMount() {
        this.getPeopleList(this.props.grade);
    }

    getPeopleList = (grade) => {
        get('people?limit=100&grade=' + grade).then(
            response => {
                console.log(response);
                this.setState({
                    people: response.data
                });
            }
        );
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    handleChange = (targetKeys) => {
        console.log(targetKeys);
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    render() {
        return (
            <div>
                <Transfer
                    dataSource={this.state.people}
                    showSearch
                    filterOption={this.filterOption}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    rowKey={item => item._id}
                    render={item => item.name}
                />
            </div>
        );
    }
}

export default PeopleSelector;