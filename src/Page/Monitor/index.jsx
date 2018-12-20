import React from 'react';
import Header from '../../Layout/Header';
import { Table, message, Popover, Input } from "antd/lib/index";

import { get, post } from "../../Utils/fetch";

const Search = Input.Search;

class Monitor extends React.Component {
    state = {
        isLoading: true,
        flight: [],
        positionVisible: false,
        inPlaceTimeVisible: false,
        estimatedArrivedVisible: false,
        plannedDepartureVisible: false,
        releaseTimeVisible: false
    };

    componentDidMount() {
        this.initFlightData();
    };

    initFlightData = () => {
        get('flight').then(
            response => {
                if(response.success) {
                    this.setState({
                        flight: response.data,
                        isLoading: false
                    });
                } else {
                    message.error(response.info);
                }
            }
        );
    };

    renderPeopleName = (record, grade) => {
        let string = '';
        record.people.map((people) => {
            if(people.grade === grade) {
                string = string.length > 0 ? string + '、' + people.name : people.name;
            }
        });
        return string;
    };

    handleDataUpdate = (data, record, timeOrPosition, key) => {
        post('flight/update', data).then(
            response => {
                if (response.success) {
                    switch (key) {
                        case 'position':
                            message.success(`${record.flightNo} 停机位修改为 ${timeOrPosition}`);
                            break;
                        case 'inPlaceTime':
                            message.success(`${record.flightNo} 于 ${timeOrPosition} 到位`);
                            break;
                        case 'releaseTime':
                            message.success(`${record.flightNo} 于 ${timeOrPosition} 放行`);
                            break;
                        case 'estimatedArrived':
                            message.success(`${record.flightNo} 进港时间 修改为 ${timeOrPosition}`);
                            break;
                        case 'plannedDeparture':
                            message.success(`${record.flightNo} 进港时间 修改为 ${timeOrPosition}`);
                            break;
                        default:;
                    }
                    this.initFlightData();
                } else {
                    message.error(response.info);
                }
            }
        )
    };

    renderPopover = (record, key) => {
        const keyValue = this.getKey(key);
        return <Popover
            trigger="click"
            content={<Search
                placeholder={"输入" + keyValue.description}
                enterButton="修改"

                onSearch={
                    value => {
                        let data = {};
                        data[key] = value;
                        this.handleDataUpdate({_id: record._id, ...data}, record, value, key);
                    }
                }
            />}
            ref={popover => this.popover = popover}
        >
            <div>{eval('record.' + key) || <a>录入</a>}</div>
        </Popover>
    };

    getKey = (key) => {
        let data;
        switch (key) {
            case 'position': data = {
                description: '停机位',
            }; break;
            case 'inPlaceTime': data = {
                description: '到位时间',
            }; break;
            case 'estimatedArrived': data = {
                description: '进港时间',
            }; break;
            case 'plannedDeparture': data = {
                description: '离港时间',
            }; break;
            case 'releaseTime': data = {
                description: '放行时间',
            }; break;
            case 'power': data = {
                description: '电源车/桥电',
            }; break;
            default:data = {
                description: '错误的 KEY',
            };
        }
        return data;
    };

    render() {
        const columns = [{
            title: '航班号',
            dataIndex: 'flightNo',
            key: 'flightNo'
        }, {
            title: '航线',
            render: (record) => {
                return record.start + ' - ' + record.end
            }
        }, {
            title: '飞机号',
            dataIndex: 'tail',
        }, {
            title: '停机位',
            render: (record) => this.renderPopover(record, 'position')
        }, {
            title: '到位时间',
            render: (record) => {
                if (record.inPlaceTime) {
                    return this.renderPopover(record, 'inPlaceTime');
                } else {
                    return <a onClick={
                        () => {
                            const inPlaceTime = new Date().getHours() + ":" + new Date().getMinutes();
                            this.handleDataUpdate({_id: record._id, inPlaceTime}, record, inPlaceTime, 'inPlaceTime');
                        }
                    }>到位</a>;
                }
            }
        }, {
            title: '进港时间',
            render: (record) => {
                return this.renderPopover(record, 'estimatedArrived');
            }
        }, {
            title: '离港时间',
            render: (record) => {
                return this.renderPopover(record, 'plannedDeparture');
            }
        }, {
            title: '放行时间',
            render: (record) => {
                if (record.releaseTime) {
                    return this.renderPopover(record, 'releaseTime');
                } else {
                    return <a onClick={
                        () => {
                            const releaseTime = new Date().getHours() + ":" + new Date().getMinutes();
                            this.handleDataUpdate({_id: record._id, releaseTime}, record, releaseTime, 'releaseTime');
                        }
                    }>放行</a>;
                }
            }
        }, {
            title: '电源车/桥电',
            render: (record) => this.renderPopover(record, 'power')
        }, {
            title: '放行人员',
            render: (record) => this.renderPeopleName(record, 'release')

        }, {
            title: '技术员',
            render: (record) => this.renderPeopleName(record, 'technician')

        }, {
            title: '机械员',
            render: (record) => this.renderPeopleName(record, 'mechanic')
        }, {
            title: '勤务员',
            render: (record) => this.renderPeopleName(record, 'attendant')
        }, {
            title: '学员',
            render: (record) => this.renderPeopleName(record, 'trainees')
        }, {
            title: '类别',
            dataIndex: 'category',
        }];

        return (
            <div>
                <Header />
                <div style={{ padding: '0 50px',  margin: '16px 0' }}>
                    <Table dataSource={this.state.flight} rowKey={(record) => record._id} columns={columns} size="small" pagination={false} loading={this.state.isLoading} />
                </div>
            </div>
        );
    }
}

export default Monitor;