import React from 'react';
import { Card, Button, message } from 'antd';
import { post } from '../../Utils/fetch';


class MyHangover extends React.PureComponent {

    number2Workshop = number => {
        let workshop;
        switch(number) {
            case 1: workshop = '一车间';break;
            case 2: workshop = '二车间';break;
            case 3: workshop = '三车间';break;
            case 4: workshop = '四车间';break;
            case 5: workshop = '定检车间';break;
            case 6: workshop = '沈阳基地';break;
            default: workshop = '一车间';
        }
        return workshop;
    };

    confirmItem = (id) => {
        post('transfer/update', {_id: id, confirm: true}).then(
            response => {
                if(response.success) {
                    this.props.initData();
                    message.success("交接事项已确认");
                } else {
                    message.error(response.info);
                }
            }
        );
    };

    timestamp2Date = timestamp => new Date(timestamp).toLocaleString().substr(0, 10).replace(/\//g, '-');

    render() {
        const { handover } = this.props;
        return (
            <div>
                {handover.map((handoverRecord, index) => {
                    return (
                        <Card
                            key={index}
                            title={this.number2Workshop(handoverRecord.workshop) +  " " + this.timestamp2Date(handoverRecord.created)}
                            extra={handoverRecord.confirm ?
                                <div>已确认</div> :
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.confirmItem(handoverRecord._id);
                                    }}
                                >
                                    确认
                                </Button>}
                        >
                            <Text2Html content={handoverRecord.content} />
                        </Card>
                    );
                })}
            </div>
        );
    }
}

const Text2Html = (props) => {
    const  createMarkup = text => {
        return {__html: text};
    };

    console.log(props);
    return <div dangerouslySetInnerHTML={createMarkup(props.content)} />;
};

export default MyHangover;