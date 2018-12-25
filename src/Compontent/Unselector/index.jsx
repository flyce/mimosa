import React from 'react';
import { Select } from 'antd';
import { get } from '../../Utils/fetch';

const Option = Select.Option;

class Unselector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            sourceData: [],
            selected: ''
        };
    }

    componentDidMount() {
        get("people?limit=1000").then(
            response => {
                if(response.success) {
                    let children =[];
                    response.data.map((people, index) => {
                        children.push(<Option key={people._id}>{people.name}</Option>);
                        return 0;
                    });
                    this.setState({
                        children,
                        sourceData: response.data
                    });
                }
            }
        );
    }

    handleChange = (value) => {
        if(value) {
            this.setState({
                selected: value
            });
            let data = this.state.sourceData;
            value.map((_id, index) => {
                data = data.filter(content => content._id !== _id);
                return 0;
            });
            this.props.updateAvailablePeople(data);
        }

    };

    render() {
        return  (<Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={[]}
            onChange={this.handleChange}
            filterOption={(input, option) => !!option.props.children.match(input)}
        >
            {this.state.children}
        </Select>);
    }
}

export default Unselector;