import React, { Component } from 'react';

// Task component - represents a single todo item
export default class Task extends Component {
    render() {
        return (
            <li className="taskClassName">
                <button className="delete" onClick={() => {
                    console.log("click");
                }}>
                    &times;
                </button>

                <span className="text">{this.props.task.text}</span>
            </li>
        );
    }
}