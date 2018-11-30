import React from 'react';
import { Menu, Layout, Icon } from "antd/lib/index";
import { Link } from 'react-router-dom';

const { Header } = Layout;

const HeaderComponent = () => (
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
            <Menu.Item key="app">
                <Link to='/app' ><Icon type="file-text" />工作情况</Link>
            </Menu.Item>
            <Menu.Item key="material">
                <Link to='/material' ><Icon type="tool" />航材使用记录</Link>
            </Menu.Item>
            <Menu.Item key="transfer">
                <Link to='/transfer'><Icon type="team" />工作交接</Link>
            </Menu.Item>
        </Menu>
    </Header>
);
export default HeaderComponent;