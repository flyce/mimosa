import React from 'react';
import { Menu, Layout, Icon, message, Modal, Form, Input } from "antd/lib/index";
import { Link } from 'react-router-dom';
import { Dropdown, Avatar } from 'antd';
import { post } from '../../Utils/fetch';
import "./style.css";
import logo from './logo.svg';
import { getItem } from "../../Utils/storage";

const { Header } = Layout;


const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleUpdatePassword, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (fieldsValue.password.length > 0) {
                if (err) return;
                form.resetFields();
                if (fieldsValue.password === fieldsValue.verifyPassword) {
                    handleUpdatePassword(fieldsValue);
                    handleModalVisible();
                } else {
                    message.error("两次密码不一致!");
                }
            }
        });
    };
    return (
        <Modal
            title="修改密码"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                {form.getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input some rule...' }],
                })(<Input placeholder="请输入密码" type="password"/>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
                {form.getFieldDecorator('verifyPassword', {
                    rules: [{ required: true, message: 'Please input some description...' }],
                })(<Input placeholder="请再输一遍" type="password"/>)}
            </FormItem>
        </Modal>
    );
});


class HeaderComponent extends React.PureComponent {
    state ={
        modalVisible: false,
        username:  this.props.username || 'Username' ,
    };

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    };


    handleUpdatePassword = data => {
        post('user/update', {
            password: data.password
        }).then(response => {
            if(response.success) {
                message.success("密码修改成功！");
            } else {
                message.error(response.info);
            }
        })
    };

    render() {
        const menu = (
            <Menu className={"menu"} selectedKeys={[]}>
                <Menu.Item key="password"
                    onClick={() => {
                        this.handleModalVisible(true);
                    }}
                >
                    <Icon type="edit" />修改密码
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Link to={"/logout"} ><Icon type="logout" />退出登录</Link>
                </Menu.Item>
            </Menu>
        );

        const parentMethods = {
            handleUpdatePassword: this.handleUpdatePassword,
            handleModalVisible: this.handleModalVisible,
        };

        return (
            <Header>
                <div className="logo headerLogo">
                    <img alt="logo" src={logo} />
                    <span>Mimosa Project</span>
                </div>
                <Menu
                    theme="light"
                    selectedKeys={[window.location.pathname.substr(1)]}
                    mode="horizontal"
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="scheduling">
                        <Link to={'/scheduling'} ><Icon type="schedule" />人员排班</Link>
                    </Menu.Item>
                    <Menu.Item key="monitor">
                        <Link to='/monitor' ><Icon type="file-text" />工作情况</Link>
                    </Menu.Item>
                    {/*<Menu.Item key="material">*/}
                        {/*<Link to='/material' ><Icon type="tool" />航材使用记录</Link>*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="transfer">
                        <Link to='/transfer'><Icon type="team" />工作交接</Link>
                    </Menu.Item>
                    <Menu.Item key="people">
                        <Link to='/people'><Icon type="solution" />人员管理</Link>
                    </Menu.Item>
                    <Menu.Item
                        className="right"
                    >
                        <Dropdown overlay={menu}>
                      <span className={"action account"}>
                        <Avatar size="small" className={"avatar"} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                        <span className={"name"}>&nbsp;{getItem("username")}</span>
                      </span>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
                <CreateForm {...parentMethods} modalVisible={this.state.modalVisible} rowkey />
            </Header>
        );
    }
}

export default HeaderComponent;