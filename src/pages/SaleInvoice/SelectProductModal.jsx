import React from "react";
import { Modal, Input, Table, Button } from "antd";

const SelectProductModal = ({ isVisible, onCancel }) => {
  return (
    <Modal
      title="Chọn sản phẩm"
      visible={isVisible}
      centered
      onCancel={onCancel}
      width={1000}
      height={650}
      footer={null}
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>
  );
};

export default SelectProductModal;
