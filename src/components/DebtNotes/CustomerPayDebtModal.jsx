import React, { useState } from "react";
import { Modal, Button, Input, Form, notification } from "antd";
import PaymentRecordAPI from "../../api/PaymentRecordAPI";

const CustomerPayDebtModal = ({ isVisible, onClose, customer, onUpdate }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log(values); // Giả sử bạn gửi thông tin này tới server
    // Gọi API tại đây để thực hiện thanh toán
    const paymentReq = {
      customerId: customer.id, // Hoặc bất kỳ cách nào bạn đang lấy customerId
      paymentAmount: values.amount,
      note: values.note,
    };

    try {
      const response = await PaymentRecordAPI.payDebt(paymentReq);
      notification.success({
        message: "Thanh toán thành công",
        description: `Đã tạo phiếu thanh toán cho khách hàng ${customer.customerName}`,
      });
      form.resetFields(); // Reset form sau khi submit thành công
      onClose(); // Đóng modal
      onUpdate();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.",
      });
    }
  };

  return (
    <Modal
      title="Lập phiếu thanh toán"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          initialValue={customer?.customerName}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Số tiền thanh toán"
          rules={[
            { required: true, message: "Vui lòng nhập số tiền thanh toán" },
          ]}
        >
          <Input type="number" prefix="₫" />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo phiếu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerPayDebtModal;
