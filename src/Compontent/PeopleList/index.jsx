import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { message, Badge, Tag } from 'antd';
import { get } from '../../Utils/fetch';
import './style.css';


class PeopleList extends React.Component {
    state = {
        people: [],
        flight: []
    };

    componentDidMount() {
        this.initFlightData();
    }

    initFlightData = () => {
        get('people?limit=100').then(
            response => {
                if (response.success) {
                    let release =[], technician = [], mechanic = [], attendant = [], trainees =[];
                    response.data.map((value, key) => {
                        if (value.grade === 'release') {
                            release.push(value);
                        }
                        if (value.grade === 'technician') {
                            technician.push(value);
                        }
                        if (value.grade === 'mechanic') {
                            mechanic.push(value);
                        }
                        if (value.grade === 'attendant') {
                            attendant.push(value);
                        }
                        if (value.grade === 'trainees') {
                            trainees.push(value);
                        }
                    });
                    this.setState({
                        people: [{
                            category: "放行",
                            grade: 'release',
                            userList: release
                        }, {
                            category: "技术员",
                            grade: 'technician',
                            userList: technician
                        }, {
                            category: "机械员",
                            grade: 'mechanic',
                            userList: mechanic
                        }, {
                            category: "勤务员",
                            grade: 'attendant',
                            userList: attendant
                        }, {
                            category: "学员",
                            grade: 'trainees',
                            userList: trainees
                        }]
                    });
                }
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

    deleteTaskRecord = (flightId, name) => {
        get(`task?flightId=${flightId}&name=${name}`).then(
            response => {
                if (!response.success) {
                    message.error('操作失败，请重试！');
                }
            }
        );
    };

    addTaskRecord = (flightId, ) => {

    };

    userDispatch = (currentFlight, peopleIndex) => {
        let peopleScheduling = currentFlight.people;
        let { flight, people } = this.state;
        people.map((value, index) => {
            if (value.grade === currentFlight.people[peopleIndex].grade) {
                value.userList.map((user, key) => {
                    if(user.name === currentFlight.people[peopleIndex].name) {
                        people[index].userList[key].count = people[index].userList[key].count - 1;
                    }
                    return 0;
                });
            }
            return 0;
        });

        peopleScheduling = peopleScheduling.filter((data) => (data.name !== currentFlight.people[peopleIndex].name));
        flight.map((value) => {
            if (value._id === currentFlight._id) {
                value.people = peopleScheduling;
            }
            return 0;
        });

        let peopleArray = currentFlight.people;
        this.logSort(peopleArray);

        this.setState({
            flight,
            people
        });

    };

    onDragEnd = result => {
        if(result.destination) {
            if(this.checkTableID(result.destination.droppableId)) {
                let data = this.state.flight;
                let people = this.state.people;
                let count = people[this.getCount(result.source.droppableId)].userList[result.source.index].count;
                data.map((value, index) => {
                    if (value._id === result.destination.droppableId) {
                        let name = this.state.people[this.getCount(result.source.droppableId)].userList[result.source.index].name;
                        let grade = this.state.people[this.getCount(result.source.droppableId)].grade;
                        let peopleArray = data[index].people;
                        if (peopleArray) {
                           if (this.userRepeatCheck(peopleArray, name)) {
                               message.error(name + " 已在当前航班中")
                           } else {
                               peopleArray.push({
                                   grade,
                                   name
                               });
                               data[index].people = peopleArray;
                               if (count) {
                                   people[this.getCount(result.source.droppableId)].userList[result.source.index].count = count + 1;
                               } else {
                                   people[this.getCount(result.source.droppableId)].userList[result.source.index].count = 1;
                               }
                           }
                        } else {
                            data[index].people = [{grade, name}];
                            if (count) {
                                people[this.getCount(result.source.droppableId)].userList[result.source.index].count = count + 1;
                            } else {
                                people[this.getCount(result.source.droppableId)].userList[result.source.index].count = 1;
                            }
                        }
                    }
                    return 0;
                });

                this.setState({
                    flight: data,
                    people
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
                        {this.state.people.map((people, index) => (
                            <Droppable droppableId={people.grade} key={index}>
                                {(provided, snapshot) => (
                                    <div className={"peopleBox " + people.grade}>
                                        <strong>{people.category}</strong>
                                        <div
                                            ref={provided.innerRef}>
                                            {people.userList.map((item, index) => (
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
                        ))}
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
                                                    this.userDispatch(flight, index);
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