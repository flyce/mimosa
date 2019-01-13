import React from 'react';
import logo from '../../assets/logo.svg';
import { Table, message, Card, Timeline, Icon } from "antd/lib/index";
import { get } from "../../Utils/fetch";
import './style.css';
import io from 'socket.io-client';
import config from '../../Config/env';
let socket = io.connect(config.socket);
const { Meta } = Card;

class LiveScreen extends React.Component {
    state = {
        isLoading: true,
        flight: [],
        positionVisible: false,
        inPlaceTimeVisible: false,
        estimatedArrivedVisible: false,
        plannedDepartureVisible: false,
        releaseTimeVisible: false,
        timestamp: Math.floor(Date.now() / 1000)
    };

    componentDidMount() {
        this.initFlightData();
        socket.on('timestamp', (data) => {
            if(data - this.state.timestamp > 2) {
                this.initFlightData();
                this.setState({
                    timestamp: data
                });
            }
        })

    };

    initFlightData = () => {
        get('cli/flight?limit=100').then(
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
            return 0;
        });
        return string;
    };

    handleArrivedTime = (time) => {
        const date = time.match(/\(\d{1,2}\)/)[0].substr(1,2);
        time = time.replace(/\(\d{1,2}\)/, '');
        time = time.length === 4 ? time : '0' + time;
        return Number(date + time);
    };

    getPeopleName =  people => {
        let data;
        people.map((p, index) => {
            if(index === 0) {
                data = p.name;
            } else {
                data = data + ' ' + p.name;
            }
        });
        return data;
    };

    getColorFlag = value => {
        if(value.releaseTime) {
            return 'colorRelease';
        } else {
            if(value.inPlaceTime) {
                return 'colorInPlace';
            } else {
                let time = value.plannedArrived;
                time = time.replace(/\(\d{1,2}\)/, '');
                const min = Number(time.substr(0, 2) * 60) + Number(time.substr(2, 2));
                const cuttentMin = Number(new Date().getHours() * 60) + Number(new Date().getMinutes());
                const dif = Math.abs(min - cuttentMin);
                if(dif < 60) {
                    return 'colorOneHour';
                }
            }
        }

    };

    timeCheck = time => {
        const mins = parseInt(time.substr(0, 2) * 60) + parseInt(time.substr(3, 2))  ;
        const currentMins = Number(new Date().getHours() * 60) + Number(new Date().getMinutes());
        if( currentMins - 120 < mins ) {
            return true;
        } else {
            return false;
        }
    };

    render() {
        const columns = [{
            title: '航班号',
            dataIndex: 'flightNo',
            key: 'flightNo',
            sorter: (a, b) => a.flightNo > b.flightNo,
        }, {
            title: '航线',
            render: (record) => {
                return record.airlines
            }
        }, {
            title: '飞机号',
            dataIndex: 'tail',
            sorter: (a, b) => a.tail.replace('B', '') - b.tail.replace('B', ''),
        }, {
            title: '停机位',
            dataIndex: 'position'
        }, {
            title: '到位时间',
            dataIndex: 'inPlaceTime'
        }, {
            title: '进港时间',
            dataIndex: 'plannedArrived',
            defaultSortOrder: 'ascend',
            sorter:
                (a, b) => !(this.handleArrivedTime(a.plannedArrived) < this.handleArrivedTime(b.plannedArrived))
        }, {
            title: '离港时间',
            dataIndex: 'plannedDeparture'
        }, {
            title: '放行时间',
            dataIndex: 'releaseTime'
        }, {
            title: '电源车',
            dataIndex: 'power'
        }, {
            title: '类别',
            dataIndex: 'category',
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
            title: '备注',
            dataIndex: 'note'
        }];

        return (
            <div>
                <div className="liveLogo">
                    <img alt="logo" src={logo} />
                    <span>Mimosa Project </span>
                </div>
                {/*<div style={{ padding: '0 20px'}}>*/}
                    {/*/!*<Table dataSource={this.state.flight} rowKey={(record) => record._id} columns={columns} size="small" pagination={false} loading={this.state.isLoading} />*!/*/}
                {/*</div>*/}
                <div style={{display: 'flex', justifyContent: 'Center'}}>
                    <Timeline mode="alternate" pending style={{marginTop: '30px', width: "900px"}}>
                        {this.state.flight.map((value, index) => {
                            if(this.timeCheck(value.plannedArrived)) {
                                return (
                                    <Timeline.Item key={value._id}>
                                        <div className="timelineItem">
                                            <div className={this.getColorFlag(value) + ' ' + 'aCard'}>
                                                <strong className="str">{value.plannedArrived + '-' + value.plannedDeparture}</strong>
                                                <div className="con">
                                                    <div>{value.flightNo}&nbsp;&nbsp;&nbsp;&nbsp;{value.tail}</div>
                                                    <div>{value.position}</div>
                                                    <div>{value.airlines}&nbsp;&nbsp;&nbsp;&nbsp;{value.category}
                                                    </div>
                                                    <div>{this.getPeopleName(value.people)}</div>
                                                    {value.note ? <div>value.note</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </Timeline.Item>
                                );
                            }
                        })}
                    </Timeline>
                </div>
            </div>
        );
    }
}

export default LiveScreen;