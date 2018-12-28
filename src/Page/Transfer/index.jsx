import React from 'react';
import { Button, Spin } from 'antd';
import Header from '../../Layout/Header';
import Work from '../../Compontent/Work';
import MyHangover from '../../Compontent/MyHandover';
import Preset from '../../Compontent/Preset';
import { message } from "antd/lib/index";
import { get, post } from "../../Utils/fetch";

class Transfer extends React.Component {
    state={
        modalVisible: false,
        transfer: {
        },
        handover: [],
        isLoading: true,
        initialValue: [],
        update: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        get('transfer').then(
            response => {
                if(response.success) {
                    console.log(response.data.length > 0);
                    this.setState({
                        handover: response.data,
                        initialValue: response.data,
                        isLoading: false,
                        update: response.data.length > 0
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

    infoCheck = () => {
        const data = this.state.transfer;
        if(data.handover === '') {
            return '交接人';
        }
        if(data.faultRetention === '<p></p>') {
            return '故障保留';
        }
        if(data.keyMonitoringFaults === '<p></p>') {
            return '重点监控故障';
        }
        if(data.aircraftConditions === '<p></p>') {
            return '飞机情况';
        }

        if(data.administrativeRequirements === '<p></p>') {
            return '行政要求';
        }

        return false;
    };

    whatTheFuck = () => {
        const flag = this.infoCheck();
        if(!flag) {
            const uri = this.state.update ? 'transfer/update' : 'transfer';
            post(uri, this.state.transfer).then(
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
        } else {
            message.error(flag + "不能为空")
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

                    >{this.state.update ? '编辑交接记录' : '新建交接记录'}</Button>
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
                    title={this.state.update ? '编辑交接记录' : '新建交接记录'}
                    width="80vw"
                    content={<Work async={this.asyncTransferData} initialValue={this.state.initialValue} update={this.state.update}/>}
                />
            </div>
        );
    }
}


export default Transfer;