import React from 'react';
import { Card, Button, message, Popover, Input } from 'antd';
import { post } from '../../Utils/fetch';

const Search = Input.Search;

class MyHangover extends React.PureComponent {

    number2Workshop = number => {
        let workshop;
        switch(Number(number)) {
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

    confirmItem = (data) => {
        post('transfer/update', data).then(
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

    dayOrNightTransfer = time => new Date(time).toLocaleString('zh-CN', {hour12: false}).substr(11,2) > 10 ? '白班' : '夜班';

    render() {
        const { handover } = this.props;
        return (
            <div>
                {handover.map((handoverRecord, index) => {
                    return (
                        <Card
                            key={index}
                            title={this.timestamp2Date(handoverRecord.created) + ' ' + this.dayOrNightTransfer(handoverRecord.created) + ' ' + this.number2Workshop(handoverRecord.handoverWorkshop) }
                            extra={handoverRecord.confirm ?
                                <div>{handoverRecord.receiverName} 已确认</div> :
                                <Popover
                                    content={<Search
                                        placeholder={"输入确认人"}
                                        enterButton="确认"
                                        onSearch={
                                            value => {
                                                this.confirmItem({_id: handoverRecord._id, receiverName: value, confirm: true})
                                            }
                                        }
                                    />}
                                trigger="click"
                                >
                                    <Button
                                        type="primary"
                                    >
                                        确认
                                    </Button>
                                </Popover>}
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