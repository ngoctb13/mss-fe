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
      modalRender={(modal) => (
        <div style={{ border: "2px solid #0066CC" }}>{modal}</div>
      )}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 15 }}
      >
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
            { min: 5, message: "Tên sản phẩm phải có ít nhất 5 ký tự!" },
            { max: 100, message: "Tên sản phẩm không được quá 100 ký tự!" },
          ]}
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
            {
              type: "text",
              min: 1,
              max: 1000,
              message: "Quy cách phải là một số dương và không quá 1,000!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="retailPrice"
          label="Giá bán"
          rules={[
            { required: true, message: "Vui lòng nhập giá bán của sản phẩm!" },
            {
              type: "text",
              min: 1,
              max: 1000000,
              message: "Giá bán phải là một số dương và không quá 1,000,000!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
          rules={[
            { max: 500, message: "Mô tả sản phẩm không được quá 500 ký tự!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
