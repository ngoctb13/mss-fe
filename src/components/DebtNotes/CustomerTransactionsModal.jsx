import React, { useEffect, useState } from "react";
import DebtPaymentHistoryAPI from "../../api/DebtPaymentHistoryAPI";
import { Button, Descriptions, Modal, Table, Tag } from "antd";

const CustomerTransactionsModal = ({ customer, isVisible, onClose }) => {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    if (isVisible && customer) {
      fetchTransactionData(customer.id);
      console.log(transactionData);
    }
  }, [customer, isVisible]);

  const fetchTransactionData = async (customerId) => {
    try {
      const response = await DebtPaymentHistoryAPI.GetByCustomer(customerId);
      setTransactionData(response.data);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const columns = [
    {
      title: "",
      key: "stt",
      width: "3%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = type === "SALE_INVOICE" ? "volcano" : "green";
        let text = type === "SALE_INVOICE" ? "NỢ" : "TRẢ NỢ";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "$ Số lượng", dataIndex: "amount", key: "amount" },
    { title: "Ngày lập phiếu", dataIndex: "recordDate", key: "recordDate" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    // Thêm các cột khác tương tự...
  ];

  return (
    <Modal
      title="Lịch sử thanh toán nợ"
      visible={isVisible}
      onCancel={onClose}
      width={1000}
      height={650}
      centered
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <Descriptions style={{ marginTop: 10, marginBottom: 10 }} bordered>
        <Descriptions.Item label="Tên">
          {customer?.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Số Điện Thoại">
          {customer?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ">
            
          {customer?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng Nợ">
          {customer?.totalDebt?.toLocaleString("vi-VN")}
        </Descriptions.Item>
      </Descriptions>
      <Table
        dataSource={transactionData}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </Modal>
  );
};

export default CustomerTransactionsModal;
