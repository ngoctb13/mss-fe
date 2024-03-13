import React, { useEffect, useState } from "react";
import { Table, DatePicker, Select, Button } from "antd";
import moment from "moment";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceDetailAPI from "../../api/SaleInvoiceDetailAPI";

const { RangePicker } = DatePicker;
const { Option } = Select;

const StockExportReportList = () => {
  // State và hàm xử lý filter tương tự như ví dụ trước
  const [filters, setFilters] = useState({
    dateRange: [moment().startOf("month"), moment().endOf("month")],
    customerId: "Tất cả",
  });
  const [customersOfStore, setCustomersOfStore] = useState([]);
  const [productExportData, setProductExportData] = useState([]);

  const totalQuantity = productExportData.reduce(
    (sum, record) => sum + parseFloat(record.totalExportQuantity || 0),
    0
  );
  const totalPrice = productExportData.reduce(
    (sum, record) => sum + parseFloat(record.totalExportPrice || 0),
    0
  );
  const funds = productExportData.reduce(
    (sum, record) => sum + parseFloat(record.totalFunds || 0),
    0
  );
  const profits = productExportData.reduce(
    (sum, record) => sum + parseFloat(record.totalProfit || 0),
    0
  );

  useEffect(() => {
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
    fetchCustomersOfStore();
    handleFilter();
  }, []);

  // Hàm xử lý khi giá trị trong filter thay đổi
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleFilter = async () => {
    // Bạn sẽ gọi API tại đây với các filter để lấy dữ liệu mới
    console.log(filters);
    try {
      const { dateRange, customerId } = filters;
      const filterParams = {
        startDate: dateRange[0]
          ? dateRange[0].format("YYYY-MM-DDTHH:mm:ss")
          : null,
        endDate: dateRange[1]
          ? dateRange[1].format("YYYY-MM-DDTHH:mm:ss")
          : null,
      };
      if (customerId !== "Tất cả") {
        filterParams.customerId = customerId;
      }
      const response = await SaleInvoiceDetailAPI.GetProductExportReport(
        filterParams
      );
      setProductExportData(response.data);
    } catch (error) {
      console.error("Error fetching filtered sale invoices:", error);
    }
  };

  const stockExportColumns = [
    {
      title: "",
      key: "stt",
      width: "4%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên hàng",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => record.product.productName,
    },
    { title: "ĐVT", dataIndex: "unit", key: "unit" },
    {
      title: "SL/Kg",
      dataIndex: "totalExportQuantity",
      key: "totalExportQuantity",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "green" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalExportPrice",
      key: "totalExportPrice",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "green" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Tiền vốn",
      dataIndex: "totalFunds",
      key: "totalFunds",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "green" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Lợi nhuận",
      dataIndex: "totalProfit",
      key: "totalProfit",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "green" }}>
          {parseFloat(text).toLocaleString()}
        </span>
      ),
    },
  ];
  return (
    <div>
      <div
        style={{
          marginBottom: 0,
          display: "flex",
        }}
      >
        <div style={{ marginRight: 120 }}>
          {/* Filter section */}
          <RangePicker
            format="DD/MM/YYYY HH:mm:ss"
            style={{ width: 150 }}
            showTime
            onChange={(dates) => handleFilterChange("dateRange", dates)}
          />
          <Select
            placeholder="Khách hàng"
            style={{ width: 100, marginLeft: 8 }}
            onChange={(value) => handleFilterChange("customerId", value)}
            defaultValue="Tất cả"
          >
            <Option value={"Tất cả"}>Tất cả</Option>
            {customersOfStore.map((cus) => (
              <Option key={cus.id} value={cus.id}>
                {cus.customerName}
              </Option> // Giả sử `cus.name` là tên của khách hàng
            ))}
          </Select>
          <Button
            type="primary"
            onClick={handleFilter}
            style={{ marginLeft: 8 }}
          >
            Xem
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "red",
              fontSize: "18px",
              marginRight: 90,
            }}
          >
            {parseFloat(totalQuantity).toLocaleString()}
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: "red",
              fontSize: "18px",
              marginRight: 90,
            }}
          >
            {parseFloat(totalPrice).toLocaleString()}
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: "red",
              fontSize: "18px",
              marginRight: 90,
            }}
          >
            {parseFloat(funds).toLocaleString()}
          </span>
          <span style={{ fontWeight: "bold", color: "red", fontSize: "18px" }}>
            {parseFloat(profits).toLocaleString()}
          </span>
        </div>
      </div>
      <div>
        {/* Table section */}
        <Table
          columns={stockExportColumns}
          dataSource={productExportData}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ y: 240 }}
          size="small"
        />
      </div>
    </div>
  );
};
export default StockExportReportList;
