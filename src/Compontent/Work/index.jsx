import React  from 'react';
import { Form, Input } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import "./style.css";

const FormItem = Form.Item;

class Work extends React.Component {
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
        setTimeout(() => {
            this.props.form.setFieldsValue({
                content: BraftEditor.createEditorState('<p><strong>故障保留：</strong></p><ol><li>Some Text Here.</li></ol><p></p><p><strong>重点监控故障：</strong></p><ol><li>Some Text Here.</li></ol><p></p><p><strong>飞机情况：</strong></p><ol><li>Some Text Here.</li></ol>')
            })
        }, 100)

    }

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
                    <FormItem {...formItemLayout} label="交接内容">
                        {getFieldDecorator('content', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                message: '请输入交接内容'
                            }],
                        })(
                            <BraftEditor
                                className="my-editor editor-wrapper"
                                // controls={controls}
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
