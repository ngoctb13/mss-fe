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

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Lập phiếu thanh toán"
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <p style={{ marginRight: 10 }}>
          <strong>Tên khách hàng:</strong>{" "}
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            {customer?.customerName}
          </span>
        </p>
        <p>
          <strong>Tổng nợ:</strong>{" "}
          <span style={{ color: "red", fontSize: "16px", fontWeight: "bold" }}>
            {customer?.totalDebt?.toLocaleString("vi-VN")} ₫
          </span>
        </p>

        <Form.Item
          name="amount"
          label="Số tiền thanh toán"
          rules={[
            { required: true, message: "Vui lòng nhập số tiền thanh toán" },
            {
              validator: (_, value) =>
                value && value > customer.totalDebt
                  ? Promise.reject(
                      new Error(
                        "Số tiền thanh toán không được vượt quá tổng nợ"
                      )
                    )
                  : Promise.resolve(),
            },
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
