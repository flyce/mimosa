import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { getItem, removeItem} from "../../Utils/storage";
import { message } from 'antd';
import { post } from '../../Utils/fetch';
import "./style.css";

import logo from '../../assets/logo.svg';


class Logout extends Component {
    componentDidMount() {
        if(getItem("token")) {
            post('user/logout').then(
                response => {
                    if(response.success) {
                        message.success(response.data);
                    } else {
                        message.error(response.info);
                    }
                }
            );
            removeItem("token");
            removeItem("username");
            removeItem("_id");
            removeItem("loginTime");
        }
    }

    render() {
        return (
            <div className="logoutform">
                <div className="loginlogo">
                    <img alt="logo" src={logo} />
                    <span>Mimosa Project</span>
                </div>
                <div
                    style={{display:"flex", justifyContent: "center"}}
                >
                    <span>已注销！</span>
                    <Link to={'/login'}>点击登录</Link>
                </div>
            </div>
        );
    }
}
export default Logout;