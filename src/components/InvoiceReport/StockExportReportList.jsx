import React, { useState } from "react";
import { Table, DatePicker, Select, Button } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const StockExportReportList = () => {
  // State và hàm xử lý filter tương tự như ví dụ trước
  const [filters, setFilters] = useState({
    dateRange: [],
    customer: "all",
  });
  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleCustomerChange = (value) => {
    setFilters({ ...filters, customer: value });
  };
  const handleSearch = () => {
    // Bạn sẽ gọi API tại đây với các filter để lấy dữ liệu mới
    console.log(filters);
    // Ví dụ: fetchData(filters);
  };

  const stockExportColumns = [
    { title: "STT", dataIndex: "index", key: "index" },
    { title: "Tên hàng", dataIndex: "itemName", key: "itemName" },
    { title: "ĐVT", dataIndex: "unit", key: "unit" },
    { title: "SL/Kg", dataIndex: "quantity", key: "quantity" },
    { title: "Thành tiền", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Tiền vốn", dataIndex: "capital", key: "capital" },
    { title: "Lợi nhuận", dataIndex: "profit", key: "profit" },
  ];
  const stockExportData = [
    {
      key: "1",
      index: "1",
      itemName: "Thơm Nàng Hoa Xốp (10kg)",
      unit: "Kg",
      quantity: "20",
      totalPrice: "260,000",
      capital: "208,000",
      profit: "52,000",
    },
    {
      key: "2",
      index: "2",
      itemName: "Thơm Dứa (10kg)",
      unit: "Kg",
      quantity: "25",
      totalPrice: "300,000",
      capital: "240,000",
      profit: "60,000",
    },
    // ... thêm các hàng khác
  ];
  return (
    <div>
      <div>
        {/* Filter section */}
        <RangePicker
          format="DD/MM/YYYY HH:mm"
          showTime
          onChange={handleDateChange}
        />
        <Select
          placeholder="Khách hàng"
          style={{ width: 200, marginLeft: 8 }}
          onChange={handleCustomerChange}
          defaultValue="all"
        >
          <Option value="all">Tất cả</Option>
          {/* Đây là phần bạn sẽ lấy từ danh sách khách hàng của mình */}
          <Option value="customer1">Khách hàng 1</Option>
          <Option value="customer2">Khách hàng 2</Option>
          {/* ... */}
        </Select>
        <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
          Xem
        </Button>
      </div>
      <div>
        {/* Table section */}
        <Table
          columns={stockExportColumns}
          dataSource={stockExportData}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ y: 240 }}
        />
      </div>
    </div>
  );
};

export default StockExportReportList;
