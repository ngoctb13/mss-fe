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
          rules={[
            { required: true, message: "Vui lòng nhập tên tài khoản!" },
            { min: 4, message: "Tên tài khoản phải có ít nhất 4 ký tự." },
            {
              pattern: /^[A-Za-z0-9_]+$/,
              message: "Tên tài khoản chỉ chứa chữ cái, số và dấu gạch dưới.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* Add additional fields if needed */}
      </Form>
    </Modal>
  );
};

export default CreateStaffModal;
