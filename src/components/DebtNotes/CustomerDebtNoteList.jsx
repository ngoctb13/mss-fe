import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
const CustomerDebtNoteList = () => {
  const expandedRowRender = () => {
    const columns = [
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
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Space size="middle">
            <a>Xem chi tiết</a>
          </Space>
        ),
      },
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        id: i.toString(),
        createdAt: "2014-12-24 23:12:00",
        totalPrice: "333333",
        oldDebt: "222222",
        totalPayment: "555555",
        pricePaid: "444444",
        newDebt: "111111",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const columns = [
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
    },
    {
      title: "Action",
      key: "operation",
      render: () => <a>Trả nợ</a>,
    },
  ];
  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      customerName: `Customer ${i}`,
      phoneNumber: "0988888888",
      address: `Address customer ${i}`,
      totalDebt: `12345${i}`,
    });
  }
  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          // defaultExpandedRowKeys: ["0"],
        }}
        dataSource={data}
        size="small"
      />
    </>
  );
};
export default CustomerDebtNoteList;
