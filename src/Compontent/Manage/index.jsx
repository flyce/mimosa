import React from 'react';

import { Table, Card, Button, Modal, Form, Input, Popconfirm, message, Select } from 'antd';

import { get, post } from "../../Utils/fetch";
import './style.css';

const Option = Select.Option;

const FormItem = Form.Item;
const formItemLayout = {
    span: '8'
};

const CreateForm = Form.create()((props) => {
    const { modalVisible, form, handleModalVisible, value, handleUpdate, handleDelete, create, initData } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            if(create) {
                post('people', {...fieldsValue}).then( response => {
                    if (response.success) {
                        initData();
                        message.info('创建成功');
                    } else {
                        message.error(response.info)
                    }
                });
            } else {
                handleUpdate({_id: value._id, ...fieldsValue});
            }
            handleModalVisible();
        });
    };

    const title = create ? "新增人员" : "人员信息修改";
    const footer = create ? [
        <Button key="cancel" onClick={() => handleModalVisible()}>取消</Button>,
        <Button key="ok" type="primary" onClick={okHandle}>
            确定
        </Button>,
    ] : [
        <Popconfirm key="confirm" title="确定删除?" onConfirm={() => {handleDelete(value)}} okText="确定" cancelText="取消">
            <Button key="reset" type="danger" ghost>
                删除
            </Button>
        </Popconfirm>,
        <Button key="cancel" onClick={() => handleModalVisible()}>取消</Button>,
        <Button key="ok" type="primary" onClick={okHandle}>
            确定
        </Button>,
    ];

    return (
        <Modal
            title={title}
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
            width="80%"
            style={{ top: 20 }}
            footer={footer}
        >
            <Form
                style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "start"}}
            >
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    className="item"
                    hasFeedback
                >
                    {form.getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入人员姓名',
                        }],
                        initialValue: value.name
                    })(
                        <Input placeholder="请输入人员姓名"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="车间"
                    className="item offset"
                    hasFeedback
                >
                    {form.getFieldDecorator('workshop', {
                        rules: [{
                            required: true, message: '请选择车间',
                        }],
                        initialValue: value.workshop
                    })(
                        <Select>
                            <Option value={1}>一车间</Option>
                            <Option value={2}>二车间</Option>
                            <Option value={3}>三车间</Option>
                            <Option value={4}>四车间</Option>
                            <Option value={5}>定检车间</Option>
                            <Option value={6} disabled>沈阳基地</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="请选择级别"
                    className="item offset"
                    hasFeedback
                >
                    {form.getFieldDecorator('grade', {
                        rules: [{
                            type: 'string',
                            required: true, message: '请选择车间',
                        }],
                        initialValue: value.grade
                    })(
                        <Select>
                            <Option value="release">放行</Option>
                            <Option value="technician">技术员</Option>
                            <Option value="mechanic">机械员</Option>
                            <Option value="attendant">勤务员</Option>
                            <Option value="trainees">无授权人员</Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
});

class Manage extends React.PureComponent {
    state = {
        modalVisible: false,
        isLoading: true,
        create: false,
        people: [],
        value: {
            _id: '0',
            name: '',
            workshop: 0,
            grade: ''
        }
    };

    componentDidMount() {
        this.initData();
    };

    initData = () => {
        get('people?limit=10000').then( response => {
            if(response.success) {
                this.setState({
                    people: response.data,
                    isLoading: false
                });
            } else {
                message.error(response.info)
            }
        });
    };

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleUpdate = (value) => {
        post('people/update', {...value}).then(
            response => {
                if (response.success) {
                    message.info('信息修改成功');
                    this.initData()
                } else {
                    message.error(response.info);
                }
            }
        );
    };

    handleDelete = (value) => {
        post('people/delete', {_id: value._id}).then(response => {
            if (response.success) {
                message.info('删除成功');
                this.handleModalVisible();
                this.initData();
            } else {
                message.error(response.info);
            }
        });
    };

    handleManage = (value) => {
        this.setState({
            value
        });
    };

    render() {
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name,
            defaultSortOrder: 'ascend',
        }, {
            title: '车间',
            dataIndex: 'workshop',
            sorter: (a, b) => a.workshop - b.workshop,
            render: (value) => {
                let workshop;
                value = Number(value);
                switch(value) {
                    case 1: workshop = '一车间';break;
                    case 2: workshop = '二车间';break;
                    case 3: workshop = '三车间';break;
                    case 4: workshop = '四车间';break;
                    case 5: workshop = '定检车间';break;
                    case 6: workshop = '沈阳基地';break;
                    default: workshop = '一车间';
                }
                return workshop;
            }
        }, {
            title: '级别',
            dataIndex: 'grade',
            filters: [{
                text: '放行',
                value: 'release',
            }, {
                text: '技术员',
                value: 'technician',
            }, {
                text: '机械员',
                value: 'mechanic',
            }, {
                text: '勤务员',
                value: 'attendant',
            }, {
                text: '学员',
                value: 'trainees',
            }],
            filterMultiple: false,
            onFilter: (value, record) => record.grade.indexOf(value) === 0,
            sorter: (a, b) => a.address > b.address,
            render: (value) => {
                let data;
                switch (value) {
                    case 'release': data = '放行'; break;
                    case 'technician': data = '技术员'; break;
                    case 'mechanic': data = '机械员'; break;
                    case 'attendant': data ='勤务员'; break;
                    default: data = '学员';break;
                }
                return data;
            }
        }, {
            title: '操作',
            render: (record) => {
                return (<a onClick={
                    () => {
                        this.handleManage(record);
                        this.setState({create: false});
                        this.handleModalVisible(true);
                    }
                }>Edit</a>);
            }
        }];

        const parentCreateMethods = {
            initData: this.initData,
            handleModalVisible: this.handleModalVisible,
            handleUpdate: this.handleUpdate,
            handleDelete: this.handleDelete
        };
        return (
            <Card>
                <div style={{marginBottom: 10}}>
                    <Button onClick={() => {
                        this.handleModalVisible(true);
                        this.setState({
                            value: {
                                name: '',
                                workshop: 1,
                                grade: ''
                            },
                            create: true
                        })
                    }}>新建</Button>&nbsp;&nbsp;
                    <Button
                        onClick={() => {
                            message.info('功能开发中');
                        }}
                    >
                        导入
                    </Button>&nbsp;&nbsp;
                </div>
                <CreateForm {...parentCreateMethods} modalVisible={this.state.modalVisible} value={this.state.value} key={record => record._id} create={this.state.create}/>
                <Table
                    bordered
                    size="middle"
                    pagination={false}
                    columns={columns}
                    loading={this.state.isLoading}
                    dataSource={this.state.people}
                    rowKey={record => record._id} />
            </Card>
        )
    }
}

export default Manage;