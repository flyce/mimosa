import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { message, Badge, Tag } from 'antd';
import { get } from '../../Utils/fetch';
import './style.css';


class PeopleList extends React.Component {
    state = {
        people: [],
        flight: [],
        release: [],
        technician: [],
        mechanic: [],
        attendant: [],
        trainees: []
    };

    componentDidMount() {
        this.initFlightData();
    }

    initFlightData = () => {
        get('people?limit=100').then(
            response => {
                // if (response.success) {
                //     let release =[], technician = [], mechanic = [], attendant = [], trainees =[];
                //     response.data.map((value, key) => {
                //         if (value.grade === 'release') {
                //             release.push(value);
                //         }
                //         if (value.grade === 'technician') {
                //             technician.push(value);
                //         }
                //         if (value.grade === 'mechanic') {
                //             mechanic.push(value);
                //         }
                //         if (value.grade === 'attendant') {
                //             attendant.push(value);
                //         }
                //         if (value.grade === 'trainees') {
                //             trainees.push(value);
                //         }
                //     });
                //     this.setState({
                //         people: [{
                //             category: "放行",
                //             grade: 'release',
                //             userList: release
                //         }, {
                //             category: "技术员",
                //             grade: 'technician',
                //             userList: technician
                //         }, {
                //             category: "机械员",
                //             grade: 'mechanic',
                //             userList: mechanic
                //         }, {
                //             category: "勤务员",
                //             grade: 'attendant',
                //             userList: attendant
                //         }, {
                //             category: "学员",
                //             grade: 'trainees',
                //             userList: trainees
                //         }]
                //     });
                // }
                this.setState({
                    people: response.data,
                    release: response.data.filter(data => data.grade === 'release'),
                    technician: response.data.filter(data => data.grade === 'technician'),
                    mechanic: response.data.filter(data => data.grade === 'mechanic'),
                    attendant: response.data.filter(data => data.grade === 'attendant'),
                    trainees: response.data.filter(data => data.grade === 'trainees')
                });
            }
        );
        get('flight').then(
            response => {
                if(response.success) {
                    this.setState({
                        flight: response.data
                    });
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

    /**
     * 排序方法，需要处理
     * @param userA
     * @param userB
     * @returns {boolean}
     */
    peopleSort = (userA, userB) => {
        return userA.grade > userB.grade;
    };

    logSort = (peopleArray) => {
        peopleArray.sort(this.peopleSort)
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

    deleteTaskRecord = (flightInfo, userInfo, flight, index) => {
        get(`task?flightId=${flightInfo._id}&name=${userInfo.name}`).then(
            response => {
                if (!response.success) {
                    message.error('操作失败，请重试！');
                } else {
                    flight[index].people = flightInfo.people.filter((data) => (data.name !== userInfo.name));
                    this.modifyCount(userInfo, 'dec');
                }
            }
        );
    };

    addTaskRecord = (flightInfo, userInfo, flight, index) => {
        flight[index].people.push(userInfo);
        this.modifyCount(userInfo, 'add');
    };

    userDispatch = (currentFlight, userInfo) => {
        console.log(currentFlight, userInfo);
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
            console.log(result);
            const {source, destination} = result;
            if(this.checkTableID(destination.droppableId)) {
                const userInfo = this.getUserInfo(source.droppableId, source.index);
                let flight = this.state.flight;
                flight.map((flightInfo, index) => {
                   if( flightInfo._id === destination.droppableId) {
                       if(!this.userRepeatCheck(flightInfo.people, userInfo.name)) {
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

    render () {
        return (
            <div className="scheduling">
                <DragDropContext onDragEnd={this.onDragEnd}>
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
            </div>
        );
    }
}

export default PeopleList;