import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import UserAPI from "../../api/UserAPI";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";
const { Option } = Select;
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
    title: "Tên hàng",
    dataIndex: "productName",
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
    title: "Đơn giá",
    dataIndex: "unitPrice",
  },
  {
    title: "Thành tiền",
    dataIndex: "totalPrice",
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
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    createdBy: undefined,
    customerId: undefined,
  });
  const [saleInvoiceData, setSaleInvoiceData] = useState([]);
  const [usersOfStore, setUsersOfStore] = useState([]);
  const [customersOfStore, setCustomersOfStore] = useState([]);

  useEffect(() => {
    // Tải danh sách nhân viên
    const fetchUsersOfStore = async () => {
      try {
        const response = await UserAPI.GetAllOfStore();
        setUsersOfStore(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        // Xử lý lỗi ở đây
      }
    };
    // Tải danh sách khách hàng
    const fetchCustomersOfStore = async () => {
      try {
        const response = await CustomerAPI.GetAllByStore();
        setCustomersOfStore(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        // Xử lý lỗi ở đây
      }
    };
    fetchUsersOfStore();
    fetchCustomersOfStore();
  }, []);

  // Hàm xử lý khi giá trị trong filter thay đổi
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

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

  // Hàm xử lý khi người dùng nhấn nút 'Lọc'
  const handleFilter = async () => {
    console.log(filters);
    try {
      const { startDate, endDate, createdBy, customerId } = filters;
      const filterParams = {
        startDate: startDate ? startDate.format("YYYY-MM-DDTHH:mm:ss") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DDTHH:mm:ss") : null,
      };
      if (createdBy !== "Tất cả") {
        filterParams.createdBy = createdBy;
      }
      // If supplierId is not "Tất cả", add it to filterParams
      if (customerId !== "Tất cả") {
        filterParams.customerId = customerId;
      }

      const response = await SaleInvoiceAPI.GetByFilter(filterParams);
      setSaleInvoiceData(response.data);
      console.table(saleInvoiceData);
    } catch (error) {
      console.error("Error fetching filtered sale invoices:", error);
    }
    // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
  };
  return (
    <div>
      <div style={{ marginRight: 50 }}>
        {/* div 1: Filters */}
        <DatePicker
          style={{ width: 100 }}
          format="DD/MM/YYYY HH:mm:ss"
          showTime
          onChange={(date) => handleFilterChange("startDate", date)}
          placeholder="Ngày bắt đầu"
        />
        <DatePicker
          style={{ width: 100 }}
          format="DD/MM/YYYY HH:mm:ss"
          showTime
          onChange={(date) => handleFilterChange("endDate", date)}
          placeholder="Ngày kết thúc"
        />
        <Select
          placeholder="Chọn nhân viên"
          style={{ width: 100 }}
          onChange={(value) => handleFilterChange("createdBy", value)}
          defaultValue={"Tất cả"}
        >
          <Option value={"Tất cả"}>Tất cả</Option>
          {usersOfStore.map((us) => (
            <Option key={us.id} value={us.username}>
              {us.username}
            </Option> // Giả sử `emp.name` là tên của nhân viên
          ))}
        </Select>
        <Select
          placeholder="Chọn khách hàng"
          style={{ width: 100 }}
          onChange={(value) => handleFilterChange("customerId", value)}
          defaultValue={"Tất cả"}
        >
          <Option value={"Tất cả"}>Tất cả</Option>
          {customersOfStore.map((cus) => (
            <Option key={cus.id} value={cus.id}>
              {cus.customerName}
            </Option> // Giả sử `cus.name` là tên của khách hàng
          ))}
        </Select>
        <Button type="primary" onClick={handleFilter}>
          Lọc
        </Button>
      </div>
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
    </div>
  );
};
export default SaleInvoiceDetail;
