import React from "react";
import { Button, Segmented, Space, Switch, Table, Typography } from "antd";
const fixedColumns = [
  {
    title: "HD",
    dataIndex: "id",
    render: (_, record) => `${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Ngày",
    render: (_, record) => `Ngày ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },

  {
    title: "Khách Hàng",
    dataIndex: "firstName",
    render: (_, record) => `Khách ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "DVT",
    dataIndex: "dvt",
  },
  {
    title: "Bao",
    dataIndex: "bao",
  },
  {
    title: "Kg",
    dataIndex: "kg",
  },
  {
    title: "Bao",
    dataIndex: "bao",
  },
  {
    title: "Đơn giá",
    dataIndex: "dongia",
  },
  {
    title: "Thành Tiền",
    dataIndex: "thanhtien",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
  },
  {
    title: "Tiền hàng",
    dataIndex: "price",
    render: (_, record) => `Giá ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Nợ cũ",
    dataIndex: "price",
    render: (_, record) => `Nợ ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Tổng cộng",
    dataIndex: "price",
    render: (_, record) => `Tổng ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Đã thu",
    dataIndex: "price",
    render: (_, record) => `Thu ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Còn lại ",
    dataIndex: "price",
    render: (_, record) => `Nợ ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
];
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100,
  },
  {
    title: "FistName",
    dataIndex: "firstName",
    width: 120,
  },
  {
    title: "LastName",
    dataIndex: "lastName",
    width: 120,
  },
];
const getData = (count) => {
  const data = new Array(count).fill(null).map((_, index) => ({
    id: index,
    firstName: `First_${index.toString(16)}`,
    lastName: `Last_${index.toString(16)}`,
    age: 25 + (index % 10),
  }));
  return data;
};
const SaleInvoiceDetail = () => {
  const [fixed, setFixed] = React.useState(true);
  const [bordered, setBordered] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [count, setCount] = React.useState(10);
  const tblRef = React.useRef(null);
  const data = React.useMemo(() => getData(count), [count]);
  const mergedColumns = React.useMemo(() => {
    if (!fixed) {
      return columns;
    }
    if (!expanded) {
      return fixedColumns;
    }
    return fixedColumns.map((col) => ({
      ...col,
      onCell: undefined,
    }));
  }, [expanded]);
  return (
    <div>
      <Table
        bordered={bordered}
        virtual
        columns={mergedColumns}
        rowKey="id"
        dataSource={empty ? [] : data}
        pagination={false}
        ref={tblRef}
      />
    </div>
  );
};
export default SaleInvoiceDetail;
