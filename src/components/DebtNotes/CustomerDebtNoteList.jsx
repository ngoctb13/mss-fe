import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";
import "./DebtNote.css";
const CustomerDebtNoteList = () => {
  const [customerData, setCustomerData] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});

  const fetchInvoiceData = async (customerId) => {
    try {
      const response = await SaleInvoiceAPI.GetByCustomer(customerId);
      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        [customerId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      // Handle error here
    }
  };

  useEffect(() => {
    const fetchCustomerDebtData = async () => {
      try {
        const response = await CustomerAPI.GetCustomerHaveDebt();
        const customers = response.data;
        setCustomerData(customers);

        customers.forEach((customer) => {
          fetchInvoiceData(customer.id);
        });
      } catch (error) {
        console.error("Error fetching customer debt data:", error);
      }
    };

    fetchCustomerDebtData();
  }, []);

  const expandedRowRender = (record) => {
    const invoiceOfCustomerData = invoiceData[record.id] || [];
    console.log(invoiceData[record.id]);

    const columns = [
      {
        title: "",
        key: "stt",
        width: "1%",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
      },
      {
        title: "Tiền hàng",
        dataIndex: "totalPrice",
        key: "totalPrice",
      },
      {
        title: "Nợ cũ",
        dataIndex: "oldDebt",
        key: "oldDebt",
        render: (text) => (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ),
      },
      {
        title: "Tổng trả",
        dataIndex: "totalPayment",
        key: "totalPayment",
        render: (text) => (
          <span style={{ fontWeight: "bold" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ),
      },
      {
        title: "Đã trả",
        dataIndex: "pricePaid",
        key: "pricePaid",
        render: (text) => (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ),
      },
      {
        title: "Còn nợ",
        dataIndex: "newDebt",
        key: "newDebt",
        render: (text) => (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {text.toLocaleString("vi-VN")}
          </span>
        ),
      },
    ];
    return (
      <Table
        columns={columns}
        bordered
        dataSource={invoiceOfCustomerData}
        pagination={false}
      />
    );
  };
  const columns = [
    {
      title: "",
      key: "stt",
      width: "1%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Công nợ",
      dataIndex: "totalDebt",
      key: "totalDebt",
      render: (text) => (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {text.toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: () => <a>Trả nợ</a>,
    },
  ];
  return (
    <>
      <Table
        bordered
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          // defaultExpandedRowKeys: ["0"],
        }}
        dataSource={customerData}
        size="small"
        rowKey="id"
      />
    </>
  );
};
export default CustomerDebtNoteList;
