import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import moment from "moment";
import UserAPI from "../../api/UserAPI";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SaleInvoiceReportList = () => {
  const [filters, setFilters] = useState({
    dateRange: [],
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

  const columns = [
    // Định nghĩa các cột theo dữ liệu bạn cần hiển thị
    // Ví dụ:
    {
      title: "",
      key: "stt",
      width: "1%",
      render: (text, record, index) => index + 1,
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    { title: "NV", dataIndex: "createdBy", key: "createdBy" },
    { title: "Tiền hàng", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Nợ cũ", dataIndex: "oldDebt", key: "oldDebt" },
    { title: "Tổng cộng", dataIndex: "totalPayment", key: "totalPayment" },
    { title: "Đã trả", dataIndex: "pricePaid", key: "pricePaid" },
    { title: "Còn nợ", dataIndex: "newDebt", key: "newDebt" },
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

  // Hàm xử lý khi giá trị trong filter thay đổi
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Hàm xử lý khi người dùng nhấn nút 'Lọc'
  const handleFilter = async () => {
    console.log(filters);
    try {
      const { dateRange, createdBy, customerId } = filters;
      const filterParams = {
        startDate: dateRange[0]
          ? dateRange[0].format("YYYY-MM-DDTHH:mm:ss")
          : null,
        endDate: dateRange[1]
          ? dateRange[1].format("YYYY-MM-DDTHH:mm:ss")
          : null,
        createdBy,
        customerId: customerId,
      };

      const response = await SaleInvoiceAPI.GetByFilter(filterParams);
      setSaleInvoiceData(response.data);
    } catch (error) {
      console.error("Error fetching filtered sale invoices:", error);
    }
    // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {/* div 1: Filters */}
        <RangePicker
          style={{ width: 150 }}
          format="DD/MM/YYYY HH:mm:ss"
          showTime
          onChange={(dates) => handleFilterChange("dateRange", dates)}
        />
        <Select
          placeholder="Chọn nhân viên"
          style={{ width: 100 }}
          onChange={(value) => handleFilterChange("createdBy", value)}
        >
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
        >
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
        {/* div 2: Table */}
        <Table columns={columns} dataSource={saleInvoiceData} />
      </div>
    </div>
  );
};

export default SaleInvoiceReportList;
