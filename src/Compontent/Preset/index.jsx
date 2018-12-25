import React from 'react';
import { Modal } from "antd/lib/index";

const Preset = (props) => {
    const { visible, content, title, handleModalVisible, onOK, width } = props;
    return (<Modal
        title={title}
        visible={visible}
        width={width}
        onOk={() => {
            onOK();
        }}
        onCancel={() => handleModalVisible()}
    >
        {content}
    </Modal>);
};

export default Preset;