import React from 'react';
import Header from '../../Layout/Header';
import PeopleSelector from '../../Compontent/PeopleSelector';
import Stepper from '../../Compontent/Stepper';

class Selector extends React.Component {
    render() {
        const steps = [{
            title: '选择放行',
            content: <div><PeopleSelector grade="release"/></div>,
        }, {
            title: '选择技术员',
            content: <div><PeopleSelector grade="technician"/></div>,
        }, {
            title: '选择机械员',
            content: <PeopleSelector grade="mechanic"/>,
        }, {
            title: '选择勤务员',
            content: <PeopleSelector grade="attendant"/>,
        }, {
            title: '选择学员',
            content: <PeopleSelector grade="trainees"/>,
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