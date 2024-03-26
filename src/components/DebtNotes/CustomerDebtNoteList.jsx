import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Space, Table } from "antd";
import {
  EyeOutlined,
  DollarCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";
import "./DebtNote.css";
import { Helmet } from "react-helmet";
import CustomerTransactionsModal from "./CustomerTransactionsModal";
import CustomerPayDebtModal from "./CustomerPayDebtModal";
const CustomerDebtNoteList = () => {
  const [customerData, setCustomerData] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [isPayDebtModalVisible, setIsPayDebtModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filterData = (data, searchText) => {
    return data.filter(
      (item) =>
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const showPayDebtModal = (customer) => {
    setSelectedCustomer(customer);
    setIsPayDebtModalVisible(true);
  };
  const handlePayDebtModalClose = () => {
    setIsPayDebtModalVisible(false);
  };

  const showTransactionModal = (customer) => {
    setSelectedCustomer(customer);
    setIsTransactionModalVisible(true);
  };

  const handleTransactionModalClose = () => {
    setIsTransactionModalVisible(false);
  };

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
        const response = await CustomerAPI.GetCustomerOrderByTotalDebt();
        const customers = response.data;
        // setCustomerData(customers);

        setCustomerData(filterData(customers, searchText));

        customers.forEach((customer) => {
          fetchInvoiceData(customer.id);
        });
      } catch (error) {
        console.error("Error fetching customer debt data:", error);
      }
    };

    fetchCustomerDebtData();
  }, [searchText]);

  const updateCustomerDataAfterPayment = () => {
    // Gọi lại API để lấy dữ liệu mới nhất của khách hàng và cập nhật state
    const fetchCustomerDebtData = async () => {
      try {
        const response = await CustomerAPI.GetCustomerOrderByTotalDebt();
        const customers = response.data;
        setCustomerData(customers);
      } catch (error) {
        console.error("Error fetching customer debt data:", error);
      }
    };

    fetchCustomerDebtData();
  };

  const columns = [
    {
      title: "TT",
      key: "stt",
      width: "3%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>
          {text.toLocaleString("vi-VN")}
        </span>
      ),
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
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => showTransactionModal(record)}
            icon={<EyeOutlined />}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
            }}
          >
            Chi tiết
          </Button>
          <Button
            onClick={() => showPayDebtModal(record)}
            icon={<DollarCircleOutlined />}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "#fff",
            }}
          >
            Trả nợ
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Helmet>
        <title>Sổ nợ - Khách hàng</title>
      </Helmet>
      <Input
        placeholder="Tìm kiếm theo tên hoặc mô tả"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200, marginBottom: 10 }}
        suffix={<SearchOutlined />}
      />
      <Table
        className="custom-table-header"
        bordered
        columns={columns}
        dataSource={customerData}
        size="small"
        rowKey="id"
      />
      <CustomerTransactionsModal
        customer={selectedCustomer}
        isVisible={isTransactionModalVisible}
        onClose={handleTransactionModalClose}
      />
      {selectedCustomer && (
        <CustomerPayDebtModal
          isVisible={isPayDebtModalVisible}
          onClose={handlePayDebtModalClose}
          customer={selectedCustomer}
          onUpdate={updateCustomerDataAfterPayment}
        />
      )}
    </>
  );
};
export default CustomerDebtNoteList;
