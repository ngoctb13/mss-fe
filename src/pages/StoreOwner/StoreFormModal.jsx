import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const StoreFormModal = ({ visible, onCreate, onCancel, store }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    await onCreate(values);
    setLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={store ? "Edit Store" : "Add New Store"}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          {store ? "Save" : "Add"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={store}
      >
        <Form.Item
          name="storeName"
          label="Store Name"
          rules={[{ required: true, message: "Please enter store name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter store address" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StoreFormModal;
