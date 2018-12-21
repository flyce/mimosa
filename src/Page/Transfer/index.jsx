import React from 'react';
import { Button, Spin } from 'antd';
import Header from '../../Layout/Header';
import Work from '../../Compontent/Work';
import MyHangover from '../../Compontent/MyHandover';
import Preset from '../../Compontent/Preset';
import {message} from "antd/lib/index";
import {get, post} from "../../Utils/fetch";

class Transfer extends React.Component {
    state={
        modalVisible: false,
        transfer: {
            handoverName: '',
            content: '<p></p>'
        },
        handover: [],
        isLoading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        get('transfer').then(
            response => {
                if(response.success) {
                    this.setState({
                        handover: response.data,
                        isLoading: false
                    });
                } else {
                    message.error(response.info);
                }
            }
        );
    };


    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleModalOk = () => {
        message.error("error");
    };

    whatTheFuck = () => {
        if(this.state.transfer.content === '<p></p>' || this.state.transfer.content === '') {
            message.error('请不要提交空白数据');
        } else {
            post('transfer', this.state.transfer).then(
                response => {
                    if(response.success) {
                        message.success("提交成功");
                        this.handleModalVisible();
                        this.initData();
                    } else {
                        message.error(response.info);
                    }
                }
            );
        }
    };

    asyncTransferData = (data) => {
        this.setState({
            transfer: data
        });
    };

    render() {

        const parentMethods = {
            handleModalOk: this.handleModalOk,
            handleModalVisible: this.handleModalVisible,
            onOK: this.whatTheFuck
        };
        return (
            <div>
                <Header />
                <div style={{ padding: '0 50px',  margin: '16px 0' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            this.handleModalVisible(true);
                        }}

                    >新建交接记录</Button>
                    <div style={{marginTop: "16px"}}>
                        {this.state.isLoading ? <div className="loading">
                                <Spin />
                            </div>:
                            <MyHangover handover={this.state.handover} initData={this.initData} />
                        }
                    </div>

                </div>
                <Preset
                    visible={this.state.modalVisible}
                    {...parentMethods}
                    title="新建交接记录"
                    width="80vw"
                    content={<Work async={this.asyncTransferData}/>}
                />
            </div>
        );
    }
}


export default Transfer;