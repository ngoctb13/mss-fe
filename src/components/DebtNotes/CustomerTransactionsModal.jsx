import React, { useEffect, useState } from "react";
import DebtPaymentHistoryAPI from "../../api/DebtPaymentHistoryAPI";
import {
  Button,
  DatePicker,
  Descriptions,
  Modal,
  Space,
  Select,
  Table,
  Tag,
} from "antd";
import { EyeOutlined, DollarCircleOutlined } from "@ant-design/icons";
import PdfAPI from "../../api/PdfAPI";
import SaleInvoiceDetailModal from "./CustomerTransactionDetail/SaleInvoiceDetailModal";
import PaymentRecordDetailModal from "./CustomerTransactionDetail/PaymentRecordDetailModal";
const { RangePicker } = DatePicker;
const { Option } = Select;

const CustomerTransactionsModal = ({ customer, isVisible, onClose }) => {
  const [transactionData, setTransactionData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [detailModalInfo, setDetailModalInfo] = useState({
    isVisible: false,
    recordType: null,
    sourceType: null,
    recordDate: null,
    sourceId: null,
  });
  const [filterType, setFilterType] = useState("all");
  const [filteredTransactionData, setFilteredTransactionData] = useState([]);

  useEffect(() => {
    if (isVisible && customer) {
      fetchTransactionData(customer.id);
    }
  }, [customer, isVisible, dateRange, filterType]);
  console.log(transactionData);

  useEffect(() => {
    filterTransactions();
  }, [transactionData, filterType]);

  const fetchTransactionData = async (customerId) => {
    try {
      console.log(dateRange);
      const filterParams = {
        customerId: customerId,
        startDate: dateRange[0],
        endDate: dateRange[1],
      };
      const response = await DebtPaymentHistoryAPI.GetByFilter(filterParams);
      setTransactionData(response.data);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const filterTransactions = () => {
    if (filterType === "all") {
      setFilteredTransactionData(transactionData);
    } else {
      const filtered = transactionData.filter((t) => t.type === filterType);
      setFilteredTransactionData(filtered);
    }
  };

  const showDetailOfTransaction = (record) => {
    setDetailModalInfo({
      isVisible: true,
      recordType: record.type,
      sourceType: record.sourceType,
      recordDate: record.recordDate,
      sourceId: record.sourceId,
    });
  };

  const closeDetailModal = () => {
    setDetailModalInfo((prevState) => ({
      ...prevState,
      isVisible: false,
    }));
  };

  const columns = [
    {
      title: " ",
      key: "stt",
      width: "3%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (type) => {
        let color = type === "SALE_INVOICE" ? "volcano" : "green";
        let text = type === "SALE_INVOICE" ? "NỢ" : "TRẢ";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "$ Số lượng",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      render: (text, record) => {
        const color = record.type === "SALE_INVOICE" ? "red" : "green"; // Giả sử type "SALE_INVOICE" là nợ, ngược lại là trả
        return <span style={{ color }}>{text.toLocaleString("vi-VN")} ₫</span>;
      },
    },
    {
      title: "Ngày lập phiếu",
      dataIndex: "recordDate",
      key: "recordDate",
      width: "20%",
    },
    { title: "Ghi chú", dataIndex: "note", key: "note", width: "30%" },
    {
      title: " ",
      key: "operation",
      render: (text, record) => (
        <Button
          size="small"
          onClick={() => showDetailOfTransaction(record)}
          icon={<EyeOutlined />}
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            color: "#fff",
          }}
        >
          Chi tiết
        </Button>
      ),
    },
    // Thêm các cột khác tương tự...
  ];

  const exportPDF = async () => {
    try {
      const filterParams = {
        customerId: customer.id,
        startDate: dateRange[0],
        endDate: dateRange[1],
      };
      const response = await PdfAPI.DownloadTransactionsPdf(filterParams);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Transactions-${customer.id}.pdf`); // Đặt tên file PDF
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleClose = () => {
    setDateRange([]);
    setFilterType("all");
    onClose();
  };

  return (
    <>
      <Modal
        title="Lịch sử thanh toán nợ"
        visible={isVisible}
        onCancel={handleClose}
        width={1000}
        height={650}
        centered
        footer={[
          <Button key="back" onClick={handleClose}>
            Đóng
          </Button>,
        ]}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginLeft: 110 }}>
            <p>
              <strong style={{ fontSize: "16px" }}>Tổng nợ:</strong>{" "}
              <span
                style={{ color: "red", fontSize: "16px", fontWeight: "bold" }}
              >
                {customer?.totalDebt?.toLocaleString("vi-VN")} ₫
              </span>
            </p>
          </div>
          <div>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setFilterType}
            >
              <Option value="all">Tất cả</Option>
              <Option value="SALE_INVOICE">NỢ</Option>
              <Option value="PAYMENT">TRẢ</Option>
            </Select>
            <RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ format: "HH:mm" }}
              onChange={(dates) => {
                setDateRange(
                  dates
                    ? dates.map((date) => date.format("YYYY-MM-DDTHH:mm:ss"))
                    : []
                );
              }}
            />
            <Button
              type="primary"
              onClick={exportPDF}
              style={{ marginRight: 8 }}
            >
              Xuất PDF
            </Button>
          </div>
        </div>
        <Table
          className="custom-table-header"
          dataSource={filteredTransactionData}
          columns={columns}
          pagination={false}
          rowKey="id"
          scroll={{ y: 280 }}
        />
      </Modal>
      {detailModalInfo.sourceType === "SALE_INVOICE" && (
        <SaleInvoiceDetailModal
          isVisible={detailModalInfo.isVisible}
          recordType={detailModalInfo.recordType}
          sourceId={detailModalInfo.sourceId}
          recordDate={detailModalInfo.recordDate}
          onClose={closeDetailModal}
        />
      )}
      {detailModalInfo.sourceType === "PAYMENT_RECORD" && (
        <PaymentRecordDetailModal
          isVisible={detailModalInfo.isVisible}
          recordType={detailModalInfo.recordType}
          sourceId={detailModalInfo.sourceId}
          recordDate={detailModalInfo.recordDate}
          onClose={closeDetailModal}
        />
      )}
    </>
  );
};

export default CustomerTransactionsModal;
