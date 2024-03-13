import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import moment from "moment";
import UserAPI from "../../api/UserAPI";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";
import dayjs from "dayjs";

const { Option } = Select;

const SaleInvoiceReportList = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    createdBy: undefined,
    customerId: undefined,
  });
  const [saleInvoiceData, setSaleInvoiceData] = useState([]);
  const [usersOfStore, setUsersOfStore] = useState([]);
  const [customersOfStore, setCustomersOfStore] = useState([]);
  const [totalDebtForCustomer, setTotalDebtForCustomer] = useState(null);

  const totalSale = saleInvoiceData.reduce(
    (sum, record) => sum + parseFloat(record.totalPrice || 0),
    0
  );
  const totalPaid = saleInvoiceData.reduce(
    (sum, record) => sum + parseFloat(record.pricePaid || 0),
    0
  );

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
      if (customerId !== "Tất cả" && customerId) {
        const totalDebt = response.data.reduce(
          (sum, record) => sum + parseFloat(record.newDebt || 0),
          0
        );
        console.log(totalDebt);
        setTotalDebtForCustomer(totalDebt);
      } else {
        setTotalDebtForCustomer(null);
      }
    } catch (error) {
      console.error("Error fetching filtered sale invoices:", error);
    }
    // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 0,
          display: "flex",
        }}
      >
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

        <div
          style={{
            display: "flex",
          }}
        >
          <p
            style={{
              marginRight: 20,
            }}
          >
            <strong>Tiền hàng:</strong>{" "}
            <span
              style={{ fontWeight: "bold", color: "red", fontSize: "18px" }}
            >
              {parseFloat(totalSale).toLocaleString()}
            </span>
          </p>
          <p
            style={{
              marginRight: 20,
            }}
          >
            <strong>Đã thu:</strong>{" "}
            <span
              style={{ fontWeight: "bold", color: "green", fontSize: "18px" }}
            >
              {parseFloat(totalPaid).toLocaleString()}
            </span>
          </p>
          {totalDebtForCustomer !== null && (
            <p>
              <strong>Còn nợ:</strong>{" "}
              <span
                style={{ fontWeight: "bold", color: "red", fontSize: "18px" }}
              >
                {parseFloat(totalDebtForCustomer).toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>
      <div>
        {/* div 2: Table */}
        <Table columns={columns} dataSource={saleInvoiceData} size="small" />
      </div>
    </div>
  );
};

export default SaleInvoiceReportList;
