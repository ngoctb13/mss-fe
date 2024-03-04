// CreateStaffModal.jsx
import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const CreateStaffModal = ({ isVisible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await onCreate(values);
      setLoading(false);
      form.resetFields();
    } catch (err) {
      setLoading(false);
      console.error("Creation failed:", err);
      // Handle creation failure (e.g., show notification)
    }
  };

  return (
    <Modal
      title="Tạo tài khoản nhân viên"
      visible={isVisible}
      centered
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Thêm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Tên tài khoản"
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        {/* Add additional fields if needed */}
      </Form>
    </Modal>
  );
};

export default CreateStaffModal;
