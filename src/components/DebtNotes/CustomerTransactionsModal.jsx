import React, { useEffect, useState } from "react";
import DebtPaymentHistoryAPI from "../../api/DebtPaymentHistoryAPI";
import { Button, Descriptions, Modal, Table, Tag } from "antd";
import { EyeOutlined, DollarCircleOutlined } from "@ant-design/icons";

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

  const showDetailOfTransaction = () => {};

  const columns = [
    {
      title: ".",
      key: "stt",
      width: "3%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (type) => {
        let color = type === "SALE_INVOICE" ? "volcano" : "green";
        let text = type === "SALE_INVOICE" ? "NỢ" : "TRẢ";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "$ Số lượng",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      render: (text, record) => {
        const color = record.type === "SALE_INVOICE" ? "red" : "green"; // Giả sử type "SALE_INVOICE" là nợ, ngược lại là trả
        return <span style={{ color }}>{text.toLocaleString("vi-VN")} ₫</span>;
      },
    },
    {
      title: "Ngày lập phiếu",
      dataIndex: "recordDate",
      key: "recordDate",
      width: "20%",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note", width: "30%" },
    {
      title: ".",
      key: "operation",
      render: (text, record) => (
        <Button
          size="small"
          onClick={() => showDetailOfTransaction(record)}
          icon={<EyeOutlined />}
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            color: "#fff",
          }}
        >
          Chi tiết
        </Button>
      ),
    },
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>
          <p style={{ marginRight: 10 }}>
            <strong>Tên khách hàng:</strong> {customer?.customerName}
          </p>
          <p>
            <strong>Tổng nợ:</strong>{" "}
            <span style={{ color: "red", fontSize: "16px" }}>
              {customer?.totalDebt?.toLocaleString("vi-VN")} ₫
            </span>
          </p>
        </div>
        <div>
          <Button type="primary" style={{ marginRight: 8 }}>
            Xuất PDF
          </Button>
        </div>
      </div>
      <Table
        className="custom-table-header"
        dataSource={transactionData}
        columns={columns}
        pagination={false}
        rowKey="id"
        scroll={{ y: 280 }}
      />
    </Modal>
  );
};

export default CustomerTransactionsModal;
