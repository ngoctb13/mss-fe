import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const CreateProductModal = ({ isVisible, onCreate, onCancel }) => {
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
      title="Tạo sản phẩm mới"
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
          name="productName"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="unit"
          label="Đơn vị tính (ĐVT)"
          rules={[{ required: false }]}
          initialValue={"Kg"}
        >
          <Input defaultValue={"Kg"} disabled placeholder="Kg" />
        </Form.Item>
        <Form.Item
          name="bag_packing"
          label="Quy cách"
          rules={[
            { required: true, message: "Vui lòng nhập quy cách của sản phẩm!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="retailPrice"
          label="Giá bán"
          rules={[
            { required: true, message: "Vui lòng nhập giá bán của sản phẩm!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
          rules={[
            { required: false, message: "Vui lòng nhập giá bán của sản phẩm!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
