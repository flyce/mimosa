import React, { Component } from 'react';
import Task from './Task';
import "./style.css";

export default class App extends Component {
    getTasks() {
        return [
            { _id: 1, text: 'This is task 1' },
            { _id: 2, text: 'This is task 2' },
            { _id: 3, text: 'This is task 3' },
        ];
    }

    renderTasks() {
        return this.getTasks().map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>交接清单</h1>

                    <form className="new-task" >
                        <input
                            type="text"
                            ref="textInput"
                            placeholder="在此创建新的交接清单"
                        />
                    </form>
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}