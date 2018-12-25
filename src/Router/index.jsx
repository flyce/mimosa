import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import history from './history.js';
import { loginVerify } from "../Utils/loginVerify";

import Scheduling from '../Page/Scheduling';
import Login from '../Page/Login';
import Transfer from '../Page/Transfer';
import Monitor from '../Page/Monitor';
import PeopleManage from '../Page/PeopleManage';
import Logout from '../Page/Logout';
import LiveScreen from '../Page/LiveScreen';

class RouterIndex extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/scheduling" component={Scheduling}/>
                    <PrivateRoute path="/monitor" component={Monitor}/>
                    <PrivateRoute path="/transfer" component={Transfer}/>
                    {/*<PrivateRoute path="/material" component={Material}/>*/}
                    <PrivateRoute path={'/people'} component={PeopleManage} />
                    <PrivateRoute path={'/logout'} component={Logout} />
                    <Route path={'/live'} component={LiveScreen} />
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        );
    }
}

const PrivateRoute = (props) => {
    return (
        loginVerify() ? <Route path={props.path} component={props.component} /> : <Route path={props.path} component={Login} />

    );
};

const NoMatch = ({location}) => (
    <div>
        <h3>未找到路由: <code>{location.pathname}</code></h3>
        <Link to="/scheduling">回主页</Link>
    </div>
);


export default RouterIndex;