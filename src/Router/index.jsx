import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import history from './history.js';

import Scheduling from '../Page/Scheduling';

import Login from '../Page/Login';
import Transfer from '../Page/Transfer';
import Monitor from '../Page/Monitor';
import Material from '../Page/Material';
import Selector from '../Page/Selector';
import PeopleManage from '../Page/PeopleManage';


class RouterIndex extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/login" component={Login} />
                    <Route path="/scheduling" component={Scheduling}/>
                    <Route path="/monitor" component={Monitor}/>
                    <Route path="/transfer" component={Transfer}/>
                    <Route path="/material" component={Material}/>
                    <Route path="/selector" component={Selector}/>
                    <Route path={'/people'} component={PeopleManage} />
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        );
    }
}

const NoMatch = ({location}) => (
    <div>
        <h3>未找到路由: <code>{location.pathname}</code></h3>
        <Link to="/scheduling">回主页</Link>
    </div>
);


export default RouterIndex;