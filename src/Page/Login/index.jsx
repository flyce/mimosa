import React, { Component } from 'react';

import "./style.css";
import { Form, Input, Row, Button, Icon, message, notification } from "antd/lib/index";
import { post } from '../../Utils/fetch';
import { setItem, getItem, removeItem} from "../../Utils/storage";
import history from '../../Router/history';
import logo from '../../assets/logo.svg';
import config from "../../Config/env";

const FormItem = Form.Item;

class NLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            username:'',
            password:'',
            submitButtonDisabled: true
        }
    }

    componentDidMount() {
        const loginTime = getItem("loginTime");
        if (Math.floor(Date.now()/1000) - loginTime > config.loginEffect) {
            removeItem("token");
            removeItem("username");
            removeItem("_id");
            removeItem("loginTime");
        } else {
            history.push("/scheduling");
        }
    }

    handleTextChange(event) {
        if (event.target.name === 'username') {
            this.setState({
                username: event.target.value
            });

            // submit button disabled control
            if (this.state.password.length > 0 && event.target.value.length > 0) {
                this.setState({
                    submitButtonDisabled: false
                });
            } else {
                this.setState({
                    submitButtonDisabled: true
                });
            }
        } else {
            this.setState({
                password: event.target.value
            });

            // submit button disabled control
            if (this.state.username.length > 0 && event.target.value.length > 0) {
                this.setState({
                    submitButtonDisabled: false
                });
            } else {
                this.setState({
                    submitButtonDisabled: true
                });
            }
        }
    }

    handleLogin() {
        // 登陆验证逻辑
        post(
            'cli/login',
            {
                "username": this.state.username,
                "password": this.state.password
            }, false).then(
                (response) => {
                    if (response.success) {
                        setItem("token", response.token);
                        setItem("username", response.username);
                        setItem("loginTime", Math.floor(Date.now()/1000));
                        const token = getItem("token");
                        if (token.length > 0) {
                            history.push("scheduling");
                            notification.open({
                                message: '欢迎',
                                duration: 5,
                                description: '欢迎使用 Mimosa 排班系统！',
                                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                            });
                        }
                    } else {
                        message.error(response.info);
                    }
                }
            );
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="form">
                <div className="loginlogo">
                    <img alt="logo" src={logo} />
                    <span>Mimosa Project</span>
                </div>
                <form>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' ,}],
                        })(
                            <Input name="username" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" onChange={this.handleTextChange.bind(this)} />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input name="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" onChange={this.handleTextChange.bind(this)} />
                        )}
                    </FormItem>
                    <Row>
                        <Button
                            disabled={this.state.submitButtonDisabled}
                            type="primary"
                            onClick={this.handleLogin.bind(this)}>
                            登录
                        </Button>
                    </Row>

                </form>
            </div>
        );
    }
}

const Login = Form.create()(NLoginForm);
export default Login;