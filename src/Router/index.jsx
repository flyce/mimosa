import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import history from './history.js';

import Scheduling from '../Page/Scheduling';

import Login from '../Page/Login';
import Transfer from '../Page/Transfer';


class RouterIndex extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/login" component={Login} />
                    <Route path="/scheduling" component={Scheduling}/>
                    <Route path="/transfer" component={Transfer}/>
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