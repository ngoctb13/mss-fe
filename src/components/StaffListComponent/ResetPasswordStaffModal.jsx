import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";

const ResetPasswordStaffModal = ({ isVisible, staff, onReset, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await onReset(staff.id, values.password);
      notification.success({
        message: "Mật khẩu đã được đặt lại thành công",
      });
    } catch (error) {
      notification.error({
        message: "Đặt lại mật khẩu thất bại",
        description: "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu.",
      });
    } finally {
      setLoading(false);
      form.resetFields();
      onCancel();
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Xóa các giá trị trong form khi hủy/cancel
    onCancel();
  };
  return (
    <Modal
      title={`Đặt lại mật khẩu cho ${staff?.username}`}
      visible={isVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Vui lòng xác nhận mật khẩu của bạn!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đặt lại mật khẩu
        </Button>
      </Form>
    </Modal>
  );
};

export default ResetPasswordStaffModal;
