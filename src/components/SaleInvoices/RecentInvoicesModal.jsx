import { Modal, Table, Select } from "antd";
import React, { useMemo, useState } from "react";
import "./SaleInvoice.css";

const RecentInvoicesModal = ({ isVisible, onClose, recentInvoices }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const customers = useMemo(() => {
    const uniqueCustomers = {};
    recentInvoices.forEach((invoice) => {
      const customer = invoice.customer;
      uniqueCustomers[customer.id] = customer.customerName; // Giả sử mỗi customer có id và customerName
    });
    return Object.entries(uniqueCustomers).map(([id, name]) => ({
      id,
      name,
    }));
  }, [recentInvoices]);

  const filteredInvoices = useMemo(() => {
    if (!selectedCustomerId) return recentInvoices;
    return recentInvoices.filter(
      (invoice) => String(invoice.customer.id) === selectedCustomerId
    );
  }, [recentInvoices, selectedCustomerId]);

  console.log(customers);
  console.log(selectedCustomerId);
  console.log(filteredInvoices);

  const columns = [
    // Định nghĩa các cột theo dữ liệu bạn cần hiển thị
    // Ví dụ:
    {
      title: " ",
      key: "stt",
      width: "1%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    { title: "NV", dataIndex: "createdBy", key: "createdBy" },
    {
      title: "Tiền hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Nợ cũ",
      dataIndex: "oldDebt",
      key: "oldDebt",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "red" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalPayment",
      key: "totalPayment",
      render: (text) => <strong>{parseFloat(text).toLocaleString()}</strong>,
    },
    {
      title: "Đã trả",
      dataIndex: "pricePaid",
      key: "pricePaid",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "green" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Còn nợ",
      dataIndex: "newDebt",
      key: "newDebt",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "red" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => record.customer.customerName,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => record.customer.phoneNumber,
    },
    {
      title: "Địa chỉ",
      dataIndex: "Địa chỉ",
      key: "Địa chỉ",
      render: (text, record) => record.customer.address,
    },
    // ... thêm các cột khác theo ảnh bạn cung cấp
  ];
  return (
    <div>
      <Modal
        title="Hóa Đơn Trong 7 Ngày Qua"
        visible={isVisible}
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <Select
          style={{ width: 200, marginBottom: 16 }}
          placeholder="Chọn khách hàng"
          onChange={(value) =>
            setSelectedCustomerId(value ? String(value) : null)
          }
          allowClear
          onClear={() => setSelectedCustomerId(null)}
        >
          {customers.map((customer) => (
            <Select.Option key={customer.id} value={customer.id.toString()}>
              {customer.name}
            </Select.Option>
          ))}
        </Select>
        <Table
          className="custom-table-header"
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default RecentInvoicesModal;
