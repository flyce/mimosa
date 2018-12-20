import React from 'react';
import { Modal, message } from "antd/lib/index";

const Preset = (props) => {
    const { visible, content, title, handleModalVisible } = props;
    return (<Modal
        title={title}
        visible={visible}
        onOk={() => {
            message.error("ok");
        }}
        onCancel={() => handleModalVisible()}
    >
        {content}
    </Modal>);
};

export default Preset;