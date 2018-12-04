import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { message, Badge, Tag } from 'antd';
import './style.css';


class PeopleList extends React.Component {
    state = {
        people: [{
            category: "放行人员",
            class: 'release',
            userList: [
                {id: 'release1', username: '何纯'},
                {id: 'release2', username: '葛慧斌'},
                {id: 'release3', username: '高建峰'},
                {id: 'release4', username: '郭嘉良'},
                {id: 'release5', username: '邹国丞'},
                {id: 'release6', username: '彭森虎'},
                {id: 'release7', username: '柯建江'},
                {id: 'release8', username: '杨小涛'},
                {id: 'release9', username: '程龙'},
                {id: 'release10', username: '孔祥杰'}
            ]
        },  {
            category: "技术员",
            class: 'technician',
            userList: [
                {id: 'technician1', username: '徐飞'},
                {id: 'technician2', username: '周旋'},
                {id: 'technician3', username: '邹懿春'},
                {id: 'technician4', username: '沈方方'},
                {id: 'technician5', username: '杨天星'},
                {id: 'technician6', username: '黄艺勇'},
                {id: 'technician7', username: '康国伟'}
            ]
        }, {
            category: "机械员",
            class: 'mechanic',
            userList: [
                {id: 'mechanic1', username: '李相聪'},
                {id: 'mechanic2', username: '舒建'},
                {id: 'mechanic3', username: '向益'},
                {id: 'mechanic4', username: '何文敏'},
                {id: 'mechanic5', username: '蔡宇恒'},
                {id: 'mechanic6', username: '杨成键'},
                {id: 'mechanic7', username: '李珺'},
                {id: 'mechanic8', username: '刘阳'}
            ]
        }, {
            category: "勤务员",
            class: 'attendant',
            userList: [
                {id: 'attendant1', username: '孟凡智'},
                {id: 'attendant2', username: '赵朋山'},
                {id: 'attendant3', username: '梁紫丰'},
                {id: 'attendant4', username: '孙赛'},
                {id: 'attendant5', username: '朱毅初'},
                {id: 'attendant6', username: '杨钦'},
                {id: 'attendant7', username: '王全峰'},
                {id: 'attendant8', username: '张家恒'},
                {id: 'attendant9', username: '薛树勇'},
                {id: 'attendant10', username: '刘震'},
                {id: 'attendant11', username: '韦永朝'},
                {id: 'attendant12', username: '陈新云'},
                {id: 'attendant13', username: '廖树成'},
                {id: 'attendant14', username: '李泽昀'}
            ]
        }, {
            category: "学员",
            class: 'trainees',
            userList: [
                {id: 'trainees1', username: '学员1'}
            ]
        }],
        aircraftList: [
            {
                id: '1596DR5328',
                flightNo: 'DR5328',
                airlines: '北海-昆明-连云港',
                aircraft: 'B1596',
                position: '153',
                in: '2300',
                out: '0745'
            },
            {
                id: '5829DR6510',
                flightNo: 'DR6510',
                airlines: '西双版纳-昆明-长治',
                aircraft: 'B5829',
                position: '151',
                in: '2258',
                out: '0705'
            },
            {
                id: '1593DR5356',
                flightNo: 'DR5356',
                airlines: '西哈努克-昆明-西哈努克',
                aircraft: 'B1593',
                position: '104',
                in: '2319',
                out: '0810'
            },
            {
                id: '1595DR6568',
                flightNo: 'DR6568',
                airlines: '西安咸阳-昆明-西安咸阳',
                aircraft: 'B1595',
                position: '152',
                in: '2352',
                out: '0640'
            },
            {
                id: '5811DR6516',
                flightNo: 'DR6516',
                airlines: '襄阳-昆明-芒市',
                aircraft: 'B5811',
                position: '519L',
                in: '0003',
                out: '0900'
            },
            {
                id: '5812DR5338',
                flightNo: 'DR5338',
                airlines: '太原-昆明-太原',
                aircraft: 'B5812',
                position: '537',
                in: '0100',
                out: '1130'
            },
            {
                id: '5830DR6520',
                flightNo: 'DR6520',
                airlines: '芒市-昆明-西双版纳',
                aircraft: 'B5830',
                position: '159',
                in: '0024',
                out: '0705'
            },
            {
                id: '1188DR6522',
                flightNo: 'DR6522',
                airlines: '成都-昆明-成都',
                aircraft: 'B1188',
                position: '521R',
                in: '0012',
                out: '0700'
            },
            {
                id: '6109DR6512',
                flightNo: 'DR6512',
                airlines: '西双版纳-昆明-西双版纳',
                aircraft: 'B6109',
                position: '106',
                in: '0056',
                out: '0750'
            },
            {
                id: 'XU997QD796',
                flightNo: 'QD796',
                airlines: '暹粒-昆明-暹粒',
                aircraft: 'XU997',
                position: '108',
                in: '0110',
                out: '0215'
            },
            {
                id: '6109DR6504',
                flightNo: 'DR6504',
                airlines: '芒市-昆明-西双版纳',
                aircraft: 'B6109',
                position: '156',
                in: '2052',
                out: '2205'
            },
            {
                id: '5830DR6508',
                flightNo: 'DR6508',
                airlines: '芒市-昆明-芒市',
                aircraft: 'B5830',
                position: '157',
                in: '2028',
                out: '2135'
            },


        ]
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

    userRepeatCheck = (userArray, username) => {
        let repeatFlag = false;
        userArray.map((value) => {
            if (value.username === username) {
                repeatFlag = true
            }
            return 0;
        });
        return repeatFlag;
    };

    userDispatch = (flight, flightIndex) => {
        let peopleScheduling = flight.people;
        let { aircraftList, people } = this.state;
        people.map((value, index) => {
            if (value.class === flight.people[flightIndex].grade) {
                value.userList.map((user, key) => {
                    if(user.username === flight.people[flightIndex].username) {
                        people[index].userList[key].count = people[index].userList[key].count - 1;
                    }
                    return 0;
                });
            }
            return 0;
        });

        peopleScheduling = peopleScheduling.filter((data) => (data.username !== flight.people[flightIndex].username));
        aircraftList.map((value) => {
            if (value.id === flight.id) {
                value.people = peopleScheduling;
            }
            return 0;
        });

        this.setState({
            aircraftList,
            people
        });

    };

    onDragEnd = result => {
        if(result.destination) {
            if(this.checkTableID(result.destination.droppableId)) {
                let data = this.state.aircraftList;
                let people = this.state.people;
                let count = people[this.getCount(result.source.droppableId)].userList[result.source.index].count;
                data.map((value, index) => {
                    if (value.id === result.destination.droppableId) {
                        let username = this.state.people[this.getCount(result.source.droppableId)].userList[result.source.index].username;
                        let grade = this.state.people[this.getCount(result.source.droppableId)].class;
                        let peopleArray = data[index].people;
                        if (peopleArray) {
                           if (this.userRepeatCheck(peopleArray, username)) {
                               message.error(username + " 已在当前航班中")
                           } else {
                               peopleArray.push({
                                   grade,
                                   username
                               });
                               data[index].people = peopleArray;
                               if (count) {
                                   people[this.getCount(result.source.droppableId)].userList[result.source.index].count = count + 1;
                               } else {
                                   people[this.getCount(result.source.droppableId)].userList[result.source.index].count = 1;
                               }
                           }
                        } else {
                            data[index].people = [{grade, username}];
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
                    aircraftList: data,
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
                            <Droppable droppableId={people.class} key={index}>
                                {(provided, snapshot) => (
                                    <div className={"peopleBox " + people.class}>
                                        <strong>{people.category}</strong>
                                        <div
                                            ref={provided.innerRef}>
                                            {people.userList.map((item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className="user"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            {item.username}
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
                        {this.state.aircraftList.map((aircraft, index ) => (
                            <Droppable droppableId={aircraft.id} key={index}>
                                {(provided, snapshot) => (
                                    <div className="aircraft">
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {aircraft.flightNo}<br />
                                            {aircraft.airlines}<br />
                                            {aircraft.aircraft}<br />
                                            {aircraft.in + " - " + aircraft.out}<br />
                                            {aircraft.people ? aircraft.people.map((value, index) => {
                                                return <Tag key={index} className={value.grade + "Tag"} closable onClick={() => {
                                                    this.userDispatch(aircraft, index);
                                                }}>{value.username}</Tag>
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