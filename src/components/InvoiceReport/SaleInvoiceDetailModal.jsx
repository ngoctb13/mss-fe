import React, { useEffect, useState } from "react";
import { Modal, List, Spin, Table } from "antd";
import SaleInvoiceDetailAPI from "../../api/SaleInvoiceDetailAPI";
import "./style.css";

const SaleInvoiceDetailModal = ({ isVisible, onClose, saleInvoice }) => {
  const [saleInvoiceDetails, setSaleInvoiceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!saleInvoice || !saleInvoice.id) return;
      setIsLoading(true);
      try {
        const response = await SaleInvoiceDetailAPI.GetBySaleInvoice(
          saleInvoice
        );
        setSaleInvoiceDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Xử lý lỗi ở đây, có thể hiển thị thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchProductDetails();
    }
  }, [saleInvoice, isVisible]);

  const columns = [
    {
      title: " ",
      key: "stt",
      width: "1%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => record.product.productName,
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => record.product.unit,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => `${parseFloat(text).toLocaleString()} VND`, // Giả sử giá trị giá là VND
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `${parseFloat(text).toLocaleString()} VND`, // Giả sử giá trị giá là VND
    },
    // Thêm các cột khác tùy thuộc vào dữ liệu bạn cần hiển thị
  ];

  const totalSum = saleInvoiceDetails.reduce(
    (sum, record) => sum + parseFloat(record.totalPrice || 0),
    0
  );

  return (
    <Modal
      title="Chi Tiết Đơn Hàng"
      visible={isVisible}
      onOk={onClose}
      onCancel={onClose}
      width={800}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Table
          className="custom-table-header"
          size="small"
          columns={columns}
          dataSource={saleInvoiceDetails}
          pagination={false} // Tùy chọn, nếu bạn không muốn hiển thị phân trang
          rowKey="id" // Đảm bảo mỗi hàng có một khóa duy nhất, sử dụng 'id' hoặc một trường phù hợp từ dữ liệu của bạn
          summary={(pageData) => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={5}>
                    <span style={{ fontWeight: "bold" }}>Tổng tiền</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {`${totalSum.toLocaleString()} VND`}
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default SaleInvoiceDetailModal;
