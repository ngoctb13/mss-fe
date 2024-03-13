import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import ImportInvoiceAPI from "../../api/ImportInvoiceAPI";
import SupplierAPI from "../../api/SupplierAPI";
import { Helmet } from "react-helmet";
const SupplierDebtNoteList = () => {
  const [supplierData, setSupplierData] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});

  const fetchInvoiceData = async (supplierId) => {
    try {
      const response = await ImportInvoiceAPI.GetBySupplier(supplierId);
      setInvoiceData((prevInvoiceData) => ({
        ...prevInvoiceData,
        [supplierId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      // Handle error here
    }
  };

  useEffect(() => {
    const fetchSupplierDebtData = async () => {
      try {
        const response = await SupplierAPI.GetSupplierHaveDebt();
        const suppliers = response.data;
        setSupplierData(suppliers);

        suppliers.forEach((supplier) => {
          fetchInvoiceData(supplier.id);
        });
      } catch (error) {
        console.error("Error fetching supplier debt data:", error);
      }
    };

    fetchSupplierDebtData();
  }, []);
  const expandedRowRender = (record) => {
    const invoiceOfSupplierData = invoiceData[record.id] || [];
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
      },
      {
        title: "Tổng trả",
        dataIndex: "totalPayment",
        key: "totalPayment",
      },
      {
        title: "Đã trả",
        dataIndex: "pricePaid",
        key: "pricePaid",
      },
      {
        title: "Còn nợ",
        dataIndex: "newDebt",
        key: "newDebt",
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={invoiceOfSupplierData}
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
      title: "Nhà cùng cấp",
      dataIndex: "supplierName",
      key: "supplierName",
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
      <Helmet>
        <title>Sổ nợ - Nhà cung cấp</title>
      </Helmet>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          // defaultExpandedRowKeys: ["0"],
        }}
        dataSource={supplierData}
        size="small"
        rowKey="id"
      />
    </>
  );
};
export default SupplierDebtNoteList;
