import React, { useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SaleInvoiceReportList = () => {
  const [filters, setFilters] = useState({
    dateRange: [],
    createdBy: undefined,
    customer: undefined,
  });

  const columns = [
    // Định nghĩa các cột theo dữ liệu bạn cần hiển thị
    // Ví dụ:
    { title: "Số HD", dataIndex: "invoiceNumber", key: "invoiceNumber" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    { title: "NV", dataIndex: "createdBy", key: "createdBy" },
    { title: "Tiền hàng", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Nợ cũ", dataIndex: "oldDebt", key: "oldDebt" },
    { title: "Tổng cộng", dataIndex: "totalPayment", key: "totalPayment" },
    { title: "Đã trả", dataIndex: "pricePaid", key: "pricePaid" },
    { title: "Còn nợ", dataIndex: "newDebt", key: "newDebt" },
    { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Địa chỉ", dataIndex: "Địa chỉ", key: "Địa chỉ" },
    // ... thêm các cột khác theo ảnh bạn cung cấp
  ];

  const data = [
    {
      key: "1",
      invoiceNumber: "102",
      createdAt: "26/12/2022 08:51",
      createdBy: "admin",
      totalPrice: "2,002,000",
      oldDebt: "0",
      totalPayment: "2,002,000",
      pricePaid: "500,000",
      newDebt: "1,502,000",
      customerName: "Yên Nhi",
      phoneNumber: "0912000111",
      address: "123 Đường A, Quận 1",
    },
    {
      key: "2",
      invoiceNumber: "101",
      createdAt: "26/12/2022 08:53",
      createdBy: "admin",
      totalPrice: "1,265,000",
      oldDebt: "0",
      totalPayment: "1,265,000",
      pricePaid: "0",
      newDebt: "1,265,000",
      customerName: "Trâm Q10",
      phoneNumber: "0912000222",
      address: "456 Đường B, Quận 10",
    },
    {
      key: "3",
      invoiceNumber: "103",
      createdAt: "26/12/2022 08:55",
      createdBy: "admin",
      totalPrice: "1,100,000",
      oldDebt: "0",
      totalPayment: "1,100,000",
      pricePaid: "300,000",
      newDebt: "800,000",
      customerName: "Phương Lan",
      phoneNumber: "0912000333",
      address: "789 Đường C, Quận 5",
    },
    // ... thêm các hàng khác theo mẫu
  ];

  // Hàm xử lý khi giá trị trong filter thay đổi
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Hàm xử lý khi người dùng nhấn nút 'Lọc'
  const handleFilter = () => {
    console.log(filters);
    // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
  };

  return (
    <div>
      <div>
        {/* div 1: Filters */}
        <RangePicker
          format="DD/MM/YYYY HH:mm:ss"
          showTime
          onChange={(dates) => handleFilterChange("dateRange", dates)}
        />
        <Select
          placeholder="Chọn nhân viên"
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("createdBy", value)}
        >
          {/* Lặp qua danh sách nhân viên để tạo Option */}
          {/* Ví dụ: */}
          <Option value="admin">admin</Option>
          {/* ... */}
        </Select>
        <Select
          placeholder="Chọn khách hàng"
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("customer", value)}
        >
          {/* Lặp qua danh sách khách hàng để tạo Option */}
          {/* Ví dụ: */}
          <Option value="Yên Nhi">Yên Nhi</Option>
          {/* ... */}
        </Select>
        <Button type="primary" onClick={handleFilter}>
          Lọc
        </Button>
      </div>
      <div>
        {/* div 2: Table */}
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default SaleInvoiceReportList;
