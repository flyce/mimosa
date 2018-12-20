import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { message, Badge, Tag, Button, Icon } from 'antd';
import { get, post } from '../../Utils/fetch';
import './style.css';
import shuffle from 'knuth-shuffle-seeded';

import Preset from '../Modal';
import Unselector from '../Unselector';

class PeopleList extends React.Component {
    state = {
        modalVisible: false,
        people: [],
        flight: [],
        release: [],
        technician: [],
        mechanic: [],
        attendant: [],
        trainees: [],
        flightDataLoading: true,
        peopleDataLoading: true,
        availablePeople: []
    };

    updateAvailablePeople = (peopleList) => {
        this.setState({
            availablePeople: peopleList
        });

        // 打乱了所有数据
        console.log(shuffle(peopleList.filter(data => data.grade === 'release')));
    };

    componentDidMount() {
        this.initFlightData();
    }

    initFlightData = () => {
        get('people?limit=100').then(
            response => {
                if(response.success) {
                    this.setState({
                        people: response.data,
                        release: response.data.filter(data => data.grade === 'release'),
                        technician: response.data.filter(data => data.grade === 'technician'),
                        mechanic: response.data.filter(data => data.grade === 'mechanic'),
                        attendant: response.data.filter(data => data.grade === 'attendant'),
                        trainees: response.data.filter(data => data.grade === 'trainees'),
                        peopleDataLoading: false
                    });
                } else {
                    message.error(response.info);
                }
            }
        );

        get('flight').then(
            response => {
                if(response.success) {
                    this.setState({
                        flight: response.data,
                        flightDataLoading: false
                    });
                    this.initCount(response.data);
                } else {
                    message.error(response.info);
                }
            }
        );
    };

    checkTableID = (id) => {
        let flag = false;
        switch (id) {
            case 'release': flag = false; break;
            case 'technician': flag = false; break;
            case 'mechanic': flag = false; break;
            case 'attendant': flag = false; break;
            case 'trainees': flag = false; break;
            default: flag = true;
        }
        return flag;
    };

    peopleSort = (userA, userB) => {
        return this.getCount(userA.grade) > this.getCount(userB.grade) ? 1 : -1;
    };

    getCount = (id) => {
        let count = 0;
        switch (id) {
            case 'release': count = 0; break;
            case 'technician': count = 1; break;
            case 'mechanic': count = 2; break;
            case 'attendant': count = 3; break;
            case 'trainees': count = 4; break;
            default: count = 0;
        }
        return count;
    };

    getUserInfo = (grade, index) => {
        let userGroup;
        switch(grade) {
            case 'release': userGroup = this.state.release;break;
            case 'technician': userGroup = this.state.technician;break;
            case 'mechanic': userGroup = this.state.mechanic;break;
            case 'attendant': userGroup = this.state.attendant;break;
            default: userGroup = this.state.trainees;break;
        }
        return userGroup[index];
    };

    modifyCount = (userInfo, addOrDecFlag) => {
        if(addOrDecFlag === "add") {
            const data = eval('this.state.' + userInfo.grade);
            data.map((info, index) => {
               if(info._id === userInfo._id) {
                   data[index].count = (data[index].count || 0) + 1;
               }
            });
        } else {
            const data = eval('this.state.' + userInfo.grade);
            data.map((info, index) => {
                if(info._id === userInfo._id) {
                    if( data[index].count && data[index].count > 0) {
                        data[index].count = (data[index].count) - 1;
                    } else {
                        message.error("内部错误");
                    }
                }
            });
        }
    };

    calcMinutes = (start, end) => {
        const startHour = Number(start.split(":")[0]);
        const startMinute = Number(start.split(":")[1]);
        const endHour = Number(end.split(":")[0]);
        const endMinute = Number(end.split(":")[1]);
        start = startHour * 60 + startMinute;
        end = endHour * 60 + endMinute;
        return end - start;
    };

    userRepeatCheck = (userArray, name) => {
        let repeatFlag = false;
        userArray.map((value) => {
            if (value.name === name) {
                repeatFlag = true
            }
            return 0;
        });
        return repeatFlag;
    };

    userClashCheck = (userInfo, flightInfo) => {
        get(`task?name=${userInfo.name}&date=${new Date().toLocaleDateString().replace(/\//g, '-')}`).then(
            response => {
                if (response.success) {
                    const { data } = response;
                    if(data.length > 0) {
                        data.map((task, index) => {
                            if(task.flightId !== flightInfo._id) {
                                const timeSpare = this.calcMinutes(flightInfo.plannedArrived, task.endTime);
                                if(0 < timeSpare && timeSpare < 30) {
                                    message.warning(`${userInfo.name} 的 ${flightInfo.flightNo} 与 ${task.flightNo} 航班间隔仅有 ${Math.abs(timeSpare)} 分钟`, 10);
                                }
                                if(timeSpare < 0) {
                                    message.warning(`${userInfo.name} 的 ${flightInfo.flightNo} 与 ${task.flightNo} 航班间隔有 ${Math.abs(timeSpare)} 分钟时间重合`, 10);
                                }
                            }
                        });
                    }
                } else {
                    message.error("请求 '任务列表错误' ，请稍后重试");
                }
            }
        );
    };

    addTaskRecord = (flightInfo, userInfo, flight, index) => {
        flight[index].people.push(userInfo);
        flight[index].people.sort(this.peopleSort);
        this.modifyCount(userInfo, 'add');
        post('flight/update', {...flight[index]}).then(
            response => {
                if(!response.success) {
                    message.error('操作失败，请重试！');
                    this.initFlightData();
                }
            }
        );
        post('task', {
            flightId: flightInfo._id,
            flightNo: flightInfo.flightNo,
            date: flightInfo.date,
            startTime: flightInfo.estimatedArrived || flightInfo.plannedArrived,
            endTime: flightInfo.estimatedDeparture || flightInfo.plannedDeparture,
            name: userInfo.name
        }).then(
            response => {
                if (!response.success) {
                    message.error("内部错误，请稍后重试！");
                    this.initFlightData();
                }
            }
        );

    };

    deleteTaskRecord = (flightInfo, userInfo, flight, index) => {
        flight[index].people = flightInfo.people.filter((data) => (data.name !== userInfo.name));
        this.modifyCount(userInfo, 'dec');
        post('flight/update', {...flight[index]}).then(
          response => {
              if(!response.success) {
                  message.error('操作失败，请重试！');
                  this.initFlightData();
              }
          }
        );
        post('task/delete', {flightId: flightInfo._id, name: userInfo.name}).then(
            response => {
                if (!response.success) {
                    message.error('操作失败，请重试！');
                    this.initFlightData();
                }
            }
        );
    };

    initCount = (flight) => {
        flight.map((flightInfo, index) => {
            if(flightInfo.people.length > 0) {
                flightInfo.people.map((peopleInfo, key) => {
                    let data;
                    switch(peopleInfo.grade) {
                        case 'release': data = this.state.release;break;
                        case 'technician': data = this.state.technician;break;
                        case 'mechanic': data = this.state.mechanic;break;
                        case 'attendant': data = this.state.attendant;break;
                        default: data = this.state.trainees;break;
                    }
                    data.map((info, index) => {
                        if(info._id === peopleInfo._id) {
                            data[index].count = (data[index].count || 0) + 1;
                        }
                    });
                    switch(peopleInfo.grade) {
                        case 'release': this.setState({release: data});break;
                        case 'technician': this.setState({technician: data});break;
                        case 'mechanic': this.setState({mechanic: data});break;
                        case 'attendant': this.setState({attendant: data});break;
                        default: this.setState({trainees: data});break;
                    }
                });
            }
        })
    };

    userDispatch = (currentFlight, userInfo) => {
        let flight = this.state.flight;
        flight.map((flightInfo, index) => {
            if(flightInfo._id === currentFlight._id) {
                this.deleteTaskRecord(flightInfo, userInfo, flight, index);
            }
        });

        this.setState({
            flight
        });
    };
    
    onDragEnd = result => {
        if(result.destination) {
            const {source, destination} = result;
            if(this.checkTableID(destination.droppableId)) {
                const userInfo = this.getUserInfo(source.droppableId, source.index);
                let flight = this.state.flight;
                flight.map((flightInfo, index) => {
                   if( flightInfo._id === destination.droppableId) {
                       if(!this.userRepeatCheck(flightInfo.people, userInfo.name)) {
                           this.userClashCheck(userInfo, flightInfo);
                           this.addTaskRecord(flightInfo, userInfo, flight, index);
                       } else {
                           message.error(`${userInfo.name} 已在当前航班中！`)
                       }

                   }
                });
            } else {
                message.error('非法操作！');
            }
        }

    };

    handlePreset = () => {
        this.setState({
            modalVisible: true
        })
    };

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleModalOk = () => {
        message.error("error");
    };

    render () {
        const parentMethods = {
            handleModalOk: this.handleModalOk,
            handleModalVisible: this.handleModalVisible,
        };

        if(this.state.flightDataLoading && this.state.peopleDataLoading) {
            return (<Icon type="loading" />);
        } else {
            return (
                <div className="scheduling">
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div>
                            <div className="preset">
                                <Button onClick={() => {
                                    message.success("导入航班数据");
                                }}>导入航班数据</Button>&nbsp;&nbsp;
                                <Button onClick={() => {
                                    this.handlePreset();
                                }}>预排班</Button>
                            </div>


                            <div className="peopleContainer">

                                {/*放行*/}
                                <Droppable droppableId="release" key='1'>
                                    {(provided, snapshot) => (
                                        <div className={"peopleBox release"}>
                                            <strong>放行人员</strong>
                                            <div
                                                ref={provided.innerRef}>
                                                {this.state.release.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className="user"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {item.name}
                                                                <Badge count={item.count ? item.count : 0} className="badge" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                {/*技术员*/}
                                <Droppable droppableId="technician" key='2'>
                                    {(provided, snapshot) => (
                                        <div className={"peopleBox technician"}>
                                            <strong>技术员</strong>
                                            <div
                                                ref={provided.innerRef}>
                                                {this.state.technician.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className="user"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {item.name}
                                                                <Badge count={item.count ? item.count : 0} className="badge" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                {/*机械员*/}
                                <Droppable droppableId="mechanic" key='3'>
                                    {(provided, snapshot) => (
                                        <div className={"peopleBox mechanic"}>
                                            <strong>机械员</strong>
                                            <div
                                                ref={provided.innerRef}>
                                                {this.state.mechanic.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className="user"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {item.name}
                                                                <Badge count={item.count ? item.count : 0} className="badge" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                {/*勤务员*/}
                                <Droppable droppableId="attendant" key='4'>
                                    {(provided, snapshot) => (
                                        <div className={"peopleBox attendant"}>
                                            <strong>勤务员</strong>
                                            <div
                                                ref={provided.innerRef}>
                                                {this.state.attendant.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className="user"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {item.name}
                                                                <Badge count={item.count ? item.count : 0} className="badge" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                {/*学员*/}
                                <Droppable droppableId="trainees" key='5'>
                                    {(provided, snapshot) => (
                                        <div className={"peopleBox trainees"}>
                                            <strong>学员</strong>
                                            <div
                                                ref={provided.innerRef}>
                                                {this.state.trainees.map((item, index) => (
                                                    <Draggable
                                                        key={item._id}
                                                        draggableId={item._id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className="user"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {item.name}
                                                                <Badge count={item.count ? item.count : 0} className="badge" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                        <div  className="aircraftContainer">
                            {this.state.flight.map((flight, index ) => (
                                <Droppable droppableId={flight._id} key={index}>
                                    {(provided, snapshot) => (
                                        <div className="aircraft">
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {flight.flightNo}<br />
                                                {flight.start} - {flight.end}<br />
                                                {flight.tail}<br />
                                                {flight.position ? flight.position : '未知机位'}<br />
                                                {flight.plannedDeparture + " - " + flight.plannedArrived}<br />
                                                {flight.people ? flight.people.map((value, index) => {
                                                    return <Tag key={index} className={value.grade + "Tag"} onClick={() => {
                                                        this.userDispatch(flight, value);
                                                    }}>{value.name}</Tag>
                                                }) : null}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                    <Preset
                        visible={this.state.modalVisible}
                        {...parentMethods}
                        title="选择不参与排班的人员"
                        content={<Unselector updateAvailablePeople={this.updateAvailablePeople} />}
                    />
                </div>
            );
        }
    }
}

export default PeopleList;