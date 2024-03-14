import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Button,
  Segmented,
  Space,
  Switch,
  Table,
  Typography,
  Select,
} from "antd";
import UserAPI from "../../api/UserAPI";
import CustomerAPI from "../../api/CustomerAPI";
import SaleInvoiceAPI from "../../api/SaleInvoiceAPI";
import "./style.css";
import SaleInvoiceDetailAPI from "../../api/SaleInvoiceDetailAPI";
const { Option } = Select;
const fixedColumns = [
  {
    title: "HĐ",
    dataIndex: "id",
    width: 50,
    fixed: "left",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Ngày",
    dataIndex: "createAt",
    width: 100,
    fixed: "left",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Khách hàng",
    dataIndex: "customerName",
    width: 100,
    fixed: "left",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Tên hàng",
    dataIndex: "productName",
    width: 100,
  },
  {
    title: "ĐVT",
    dataIndex: "unit",
    width: 80,
  },
  {
    title: "Bao",
    dataIndex: "quantityBag",
    width: 80,
  },
  {
    title: "Kg",
    dataIndex: "quantityKg",
    width: 80,
  },
  {
    title: "Đơn giá",
    dataIndex: "unitPrice",
    width: 100,
  },
  {
    title: "Thành tiền",
    dataIndex: "totalPrice",
    width: 100,
  },
  {
    title: "Tiền hàng",
    dataIndex: "totalInvoicePrice",
    width: 100,
    fixed: "right",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Nợ cũ",
    dataIndex: "oldDebt",
    width: 100,
    fixed: "right",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Tổng cộng",
    dataIndex: "totalPayment",
    width: 100,
    fixed: "right",
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: "Đã thu",
    dataIndex: "pricePaid",
    width: 100,
    fixed: "right",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: "Còn lại",
    dataIndex: "newDebt",
    width: 100,
    fixed: "right",
    onCell: (record, index, allRecords) => {
      if (record._isFirstItem) {
        const rowSpanCount = allRecords.filter(
          (r) => r._rowSpanId === record._rowSpanId
        ).length;
        return {
          rowSpan: rowSpanCount,
        };
      }
      return {
        rowSpan: 0,
      };
    },
  },
];
const SaleInvoiceDetail = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    createdBy: undefined,
    customerId: undefined,
  });
  const [saleInvoiceData, setSaleInvoiceData] = useState([]);
  const [usersOfStore, setUsersOfStore] = useState([]);
  const [customersOfStore, setCustomersOfStore] = useState([]);

  const transformData = (data) => {
    let transformedData = [];

    // data.forEach((invoice) => {
    //   // Giả sử mỗi hóa đơn có một mảng 'details' chứa thông tin sản phẩm
    //   invoice.details.forEach((detail, index) => {
    //     transformedData.push({
    //       // Các trường thông tin chung của hóa đơn
    //       id: invoice.id,
    //       createAt: invoice.createAt,
    //       customerName: invoice.customerName,
    //       totalInvoicePrice: invoice.totalPrice,
    //       oldDebt: invoice.oldDebt,
    //       totalPayment: invoice.totalPayment,
    //       pricePaid: invoice.pricePaid,
    //       newDebt: invoice.newDebt,

    //       // Các trường thông tin chi tiết sản phẩm
    //       productName: detail.productName,
    //       unit: detail.unit,
    //       // quantityBag: detail.quantityBag,
    //       quantityKg: detail.quantityKg,
    //       unitPrice: detail.unitPrice,
    //       totalPrice: detail.totalPrice,

    //       // Xử lý rowSpan
    //       _rowSpanId: invoice.id, // Một trường phụ giúp xử lý rowSpan
    //       _isFirstItem: index === 0, // Kiểm tra nếu đây là mục đầu tiên trong danh sách chi tiết
    //     });
    //   });
    // });
    data.forEach((invoice) => {
      const detailCount = invoice.details.length;

      if (invoice.details && invoice.details.length) {
        invoice.details.forEach((detail, index) => {
          transformedData.push({
            id: invoice.id,
            createAt: invoice.createdAt,
            customerName: invoice.customer.customerName,
            productName: detail.product.productName,
            unit: detail.product.unit,
            // quantityBag: detail.quantityBag,
            quantityKg: detail.quantity,
            unitPrice: detail.unitPrice,
            totalPrice: detail.totalPrice,
            totalInvoicePrice: invoice.totalPrice,
            oldDebt: invoice.oldDebt,
            totalPayment: invoice.totalPayment,
            pricePaid: invoice.pricePaid,
            newDebt: invoice.newDebt,
            detailCount: detailCount,
            _isFirstItem: index === 0,
          });
        });
      }
    });
    return transformedData;
  };
  ////////////////////////////////////////////////////
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
      //////////////
      const fetchSaleInvoiceDetails = async (invoice) => {
        try {
          const response = await SaleInvoiceDetailAPI.GetBySaleInvoice(invoice);
          return response.data; // Giả sử đây là mảng chi tiết sản phẩm
        } catch (error) {
          console.error("Error fetching sale invoice details:", error);
        }
      };

      const response = await SaleInvoiceAPI.GetByFilter(filterParams);
      const saleInvoices = response.data;

      const saleInvoiceDetails = await Promise.all(
        saleInvoices.map(async (invoice) => {
          const details = await fetchSaleInvoiceDetails(invoice);
          return {
            ...invoice,
            details,
          };
        })
      );
      const transformedData = transformData(saleInvoiceDetails);
      setSaleInvoiceData(transformedData);
      console.log(saleInvoiceData);
    } catch (error) {
      console.error("Error fetching filtered sale invoices:", error);
    }
    // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
  };

  ////
  const fixedColumns = [
    {
      title: "HĐ",
      dataIndex: "id",
      width: 50,
      fixed: "left",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Ngày",
      dataIndex: "createAt",
      width: 100,
      fixed: "left",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      width: 100,
      fixed: "left",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Tên hàng",
      dataIndex: "productName",
      width: 120,
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      width: 80,
    },
    {
      title: "Bao",
      dataIndex: "quantityBag",
      width: 80,
    },
    {
      title: "Kg",
      dataIndex: "quantityKg",
      width: 80,
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 100,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      width: 100,
    },
    {
      title: "Tiền hàng",
      dataIndex: "totalInvoicePrice",
      width: 100,
      fixed: "right",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Nợ cũ",
      dataIndex: "oldDebt",
      width: 100,
      fixed: "right",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalPayment",
      width: 100,
      fixed: "right",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Đã thu",
      dataIndex: "pricePaid",
      width: 100,
      fixed: "right",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
    {
      title: "Còn lại",
      dataIndex: "newDebt",
      width: 100,
      fixed: "right",
      onCell: (record) => {
        if (record._isFirstItem) {
          return {
            rowSpan: record.detailCount,
          };
        }
        return {
          rowSpan: 0,
        };
      },
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Space>
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
        </Space>
        <Table
          bordered
          virtual
          columns={fixedColumns}
          scroll={{
            x: "max-content",
            y: 800,
          }}
          style={{ width: "100%", height: "100%" }}
          rowKey="id"
          dataSource={saleInvoiceData}
          pagination={false}
        />
      </Space>
    </div>
  );
};
export default SaleInvoiceDetail;
