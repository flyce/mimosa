import React  from 'react';
import { Form, Input, Radio } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.css";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Work extends React.Component {
    constructor(props) {
        super(props);
        const { update } = this.props;
        const {
            clean,
            car,
            faultRetention,
            keyMonitoringFaults,
            aircraftConditions,
            administrativeRequirements,
            handoverName,
            note,
            _id
        } = update ? this.props.initialValue[0] : {
            clean: '1',
            car: '1',
            faultRetention: '<p></p>',
            keyMonitoringFaults: '<p></p>',
            aircraftConditions: '<p></p>',
            administrativeRequirements: '<p></p>',
            handoverName: '',
            note: '',
            _id: null
        };
        this.state = {
            clean,
            car,
            faultRetention: BraftEditor.createEditorState(faultRetention),
            keyMonitoringFaults: BraftEditor.createEditorState(keyMonitoringFaults),
            aircraftConditions: BraftEditor.createEditorState(aircraftConditions),
            administrativeRequirements: BraftEditor.createEditorState(administrativeRequirements),
            handoverName,
            note,
            _id
        };
    }

    handover = e => {
        this.setState({
            handoverName: e.target.value
        });
        this.props.async({...this.state, handover: e.target.value});
    };

    note = e => {
        this.setState({
            note: e.target.value
        });
        this.props.async({...this.state, note: e.target.value});
    };

    faultRetention = (editorState) => {
        this.setState({
            faultRetention: editorState.toHTML()
        });
        this.props.async({...this.state, keyMonitoringFaults: editorState.toHTML()});
    };

    keyMonitoringFaults = (editorState) => {
        this.setState({
            keyMonitoringFaults: editorState.toHTML()
        });
        this.props.async({...this.state, keyMonitoringFaults: editorState.toHTML()});
    };


    aircraftConditions = (editorState) => {
        this.setState({
            aircraftConditions: editorState.toHTML()
        });
        this.props.async({...this.state, aircraftConditions: editorState.toHTML()});
    };

    administrativeRequirements= (editorState) => {
        this.setState({
            administrativeRequirements: editorState.toHTML()
        });
        this.props.async({...this.state, administrativeRequirements: editorState.toHTML()});
    };

    onChangeClean = e => {
        this.setState({
            clean: e.target.value,
        });
        this.props.async({...this.state, clean: e.target.value});
    };

    onChangeCar = e => {
        this.setState({
            car: e.target.value,
        });
        this.props.async({...this.state, car: e.target.value});
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator' ];

        const { clean, car, faultRetention, keyMonitoringFaults,
            aircraftConditions, administrativeRequirements, handoverName, note } = this.state;
        return (
            <div className="demo-container">
                <Form>
                    <FormItem {...formItemLayout} label="交接人">
                        <Input size="large" placeholder="请输入交接人" style={{ width: '90%'}} onChange={this.handover} value={handoverName}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="日常工作">
                        <div>值班室卫生是否已打扫：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <RadioGroup onChange={this.onChangeClean} value={clean}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                                <Radio value={3}>N/A</Radio>
                            </RadioGroup>
                        </div>

                        <div>车辆外观完好，完成加油：&nbsp;
                            <RadioGroup onChange={this.onChangeCar} value={car}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                                <Radio value={3}>N/A</Radio>
                            </RadioGroup>
                        </div>

                        <Input size="large" placeholder="备注" style={{ width: '90%'}} onChange={this.note} value={note}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="故障保留">
                        <BraftEditor
                            className="editor-wrapper"
                            controls={controls}
                            placeholder="请输入交接内容"
                            onChange={this.faultRetention}
                            style={{ width: '90%'}}
                            value={faultRetention}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="重点监控故障">
                        <BraftEditor
                            className="editor-wrapper"
                            controls={controls}
                            placeholder="请输入交接内容"
                            onChange={this.keyMonitoringFaults}
                            style={{ width: '90%'}}
                            value={keyMonitoringFaults}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="飞机情况">
                        <BraftEditor
                            className="editor-wrapper"
                            controls={controls}
                            placeholder="请输入交接内容"
                            onChange={this.aircraftConditions}
                            style={{ width: '90%'}}
                            value={aircraftConditions}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="行政要求">
                        <BraftEditor
                            className="editor-wrapper"
                            controls={controls}
                            placeholder="请输入交接内容"
                            onChange={this.administrativeRequirements}
                            style={{ width: '90%'}}
                            value={administrativeRequirements}
                        />
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Work
