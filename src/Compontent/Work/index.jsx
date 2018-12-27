import React  from 'react';
import { Form, Input, Radio } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.css";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Work extends React.Component {
    state = {
        clean: 2,
        car: 2
    };

    handleChange = (editorState) => {
        if(editorState.toHTML() !== '<p></p>') {
            this.props.form.validateFields((error, values) => {
                if (!error) {
                    const submitData = {
                        handoverName: values.hangoverName,
                        content: values.content.toHTML()
                    };
                    this.props.async(submitData);
                }
            });
        }

    };

    componentDidMount () {

        // 异步设置编辑器内容
        // setTimeout(() => {
        //     this.props.form.setFieldsValue({
        //         content: BraftEditor.createEditorState('<p><strong>故障保留：</strong></p><ol><li>Some Text Here.</li></ol><p></p><p><strong>重点监控故障：</strong></p><ol><li>Some Text Here.</li></ol><p></p><p><strong>飞机情况：</strong></p><ol><li>Some Text Here.</li></ol>')
        //     })
        // }, 100);

    }

    onChangeClean = e => {
        this.setState({
            clean: e.target.value,
        });
    };

    onChangeCar = e => {
        this.setState({
            car: e.target.value,
        });
    };

    render () {

        const { getFieldDecorator } = this.props.form;
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

        return (
            <div className="demo-container">
                <Form>
                    <FormItem {...formItemLayout} label="交接人">
                        {getFieldDecorator('hangoverName', {
                            rules: [{
                                required: true,
                                message: '请输入交接人'
                            }],
                        })(
                            <Input size="large" placeholder="请输入交接人" style={{ width: '90%'}}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="日常工作">
                        {getFieldDecorator('clean', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <div>值班室卫生是否已打扫：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <RadioGroup onChange={this.onChangeClean} value={this.state.clean}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                    <Radio value={3}>N/A</Radio>
                                </RadioGroup>
                            </div>
                        )}
                        {getFieldDecorator('car', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <div>车辆外观完好，完成加油：&nbsp;
                                <RadioGroup onChange={this.onChangeCar} value={this.state.car}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                    <Radio value={3}>N/A</Radio>
                                </RadioGroup>
                            </div>
                        )}
                        {getFieldDecorator('note', {
                            rules: [{
                                required: true,
                                message: '请输入交接人'
                            }],
                        })(
                            <Input size="large" placeholder="备注" style={{ width: '90%'}}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="故障保留">
                        {getFieldDecorator('faultRetention', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <BraftEditor
                                className="editor-wrapper"
                                controls={controls}
                                placeholder="请输入交接内容"
                                onChange={this.handleChange}
                                style={{ width: '90%'}}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="重点监控故障">
                        {getFieldDecorator('keyMonitoringFaults', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <BraftEditor
                                className="editor-wrapper"
                                controls={controls}
                                placeholder="请输入交接内容"
                                onChange={this.handleChange}
                                style={{ width: '90%'}}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="飞机情况">
                        {getFieldDecorator('aircraftConditions', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <BraftEditor
                                className="editor-wrapper"
                                controls={controls}
                                placeholder="请输入交接内容"
                                onChange={this.handleChange}
                                style={{ width: '90%'}}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="行政要求">
                        {getFieldDecorator('administrativeRequirements', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <BraftEditor
                                className="editor-wrapper"
                                controls={controls}
                                placeholder="请输入交接内容"
                                onChange={this.handleChange}
                                style={{ width: '90%'}}
                            />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Work)
