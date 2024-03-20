// File: AddLocationModal.js
import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddZoneModal = ({ isVisible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={isVisible}
      title="Thêm vị trí mới"
      okText="Tạo"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
      >
        <Form.Item
          name="locationName"
          label="Tên vị trí"
          rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input type="textarea" />
        </Form.Item>
        {/* Thêm các trường dữ liệu khác theo yêu cầu */}
      </Form>
    </Modal>
  );
};

export default AddZoneModal;
