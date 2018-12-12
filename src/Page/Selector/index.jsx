import React from 'react';
import Header from '../../Layout/Header';
import PeopleSelector from '../../Compontent/PeopleSelector';
import Stepper from '../../Compontent/Stepper';

class Selector extends React.Component {
    render() {
        const steps = [{
            title: '选择放行',
            content: <PeopleSelector category="release"/>,
        }, {
            title: '选择技术员',
            content: <PeopleSelector category="technician"/>,
        }, {
            title: '选择机械员',
            content: <PeopleSelector category="mechanic"/>,
        }, {
            title: '选择勤务员',
            content: <PeopleSelector category="attendant"/>,
        }, {
            title: '选择学员',
            content: <PeopleSelector category="trainees"/>,
        }, {
            title: '确认人员名单',
            content: '确认人员名单'
        }, {
            title: '导入航班计划',
            content: '导入航班计划'
        }];

        return (
            <div>
                <Header />
                <div className="content">
                    <Stepper steps={steps}/>
                </div>
            </div>
        );
    }
}

export default Selector;