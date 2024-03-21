import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const CreateSupplierModal = ({ isVisible, onCreate, onCancel }) => {
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
      title="Tạo nhà cung cấp"
      visible={isVisible}
      centered
      onCancel={onCancel}
      width={600}
      //   height={650}
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
          name="supplierName"
          label="Tên nhà cung cấp"
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
            { min: 2, message: "Tên nhà cung cấp phải có ít nhất 2 ký tự!" },
            { max: 50, message: "Tên nhà cung cấp không được quá 50 ký tự!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ!" },
            { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!" },
            { max: 100, message: "Địa chỉ không được quá 100 ký tự!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSupplierModal;
