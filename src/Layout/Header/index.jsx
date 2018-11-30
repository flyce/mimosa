import React from 'react';
import { Menu, Layout, Icon } from "antd/lib/index";
import { Link } from 'react-router-dom';
import { Dropdown, Avatar, Tooltip, Form, Modal, Input, message } from 'antd';
import "./style.css";

const { Header } = Layout;

const HeaderComponent = () => {
    const menu = (
        <Menu className={"menu"} selectedKeys={[]}>
            <Menu.Item key="password"

            >
                <Icon type="edit" />修改密码
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">
                <Link to={"/logout"} ><Icon type="logout" />退出登录</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Header>
            <div className="logo" />
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
                <Menu.Item key="material">
                    <Link to='/material' ><Icon type="tool" />航材使用记录</Link>
                </Menu.Item>
                <Menu.Item key="transfer">
                    <Link to='/transfer'><Icon type="team" />工作交接</Link>
                </Menu.Item>
                <Menu.Item
                    className="right"
                >
                    <Dropdown overlay={menu}>
                      <span className={"action account"}>
                        <Avatar size="small" className={"avatar"} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                        <span className={"name"}>Echo</span>
                      </span>
                    </Dropdown>
                </Menu.Item>
            </Menu>
        </Header>
    );
};
export default HeaderComponent;