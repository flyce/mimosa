import React from 'react';

import { Transfer } from 'antd';

class PeopleSelector extends React.Component {
    state = {
        mockData: [],
        targetKeys: [],
    };

    getPeopleList = (category) => {
        let data;
        switch(category) {
            case 'release': data = [{
                key: 1,
                title: '放行1'
            }, {
                key: 2,
                title: '放行2'
            }, {
                key: 3,
                title: '放行3'
            }, {
                key: 4,
                title: '放行4'
            }]; break;
            case 'technician': data = [{
                key: 5,
                title: '技术员1'
            }, {
                key: 6,
                title: '技术员2'
            }, {
                key: 7,
                title: '技术员3'
            }, {
                key: 8,
                title: '技术员4'
            }]; break;
            case 'mechanic': data = [{
                key: 9,
                title: '机械员1'
            }, {
                key: 10,
                title: '机械员2'
            }, {
                key: 11,
                title: '机械员3'
            }, {
                key: 12,
                title: '机械员4'
            }]; break;
            case 'attendant': data = [{
                key: 13,
                title: '勤务员1'
            }, {
                key: 14,
                title: '勤务员2'
            }, {
                key: 15,
                title: '勤务员3'
            }, {
                key: 16,
                title: '勤务员4'
            }]; break;
            case 'trainees': data = [{
                key: 17,
                title: '学员1'
            }, {
                key: 18,
                title: '学员2'
            }, {
                key: 19,
                title: '学员3'
            }, {
                key: 20,
                title: '学员4'
            }]; break;
            default: data = [{
                key: 21,
                title: '其他人员1'
            }, {
                key: 22,
                title: '其他人员2'
            }, {
                key: 23,
                title: '其他人员3'
            }, {
                key: 24,
                title: '其他人员4'
            }]; break;
        }
        return data;
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    render() {
        return (
            <div>
                <Transfer
                    dataSource={this.getPeopleList(this.props.category)}
                    showSearch
                    filterOption={this.filterOption}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    render={item => item.title}
                />
            </div>
        );
    }
}

export default PeopleSelector;