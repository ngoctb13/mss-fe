import React, { useEffect, useState } from "react";
import SaleInvoiceAPI from "../../../api/SaleInvoiceAPI";
import { Descriptions, Modal, Spin, Tag } from "antd";

const SaleInvoiceDetailModal = ({
  isVisible,
  recordType,
  sourceId,
  recordDate,
  onClose,
}) => {
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const ps =
    "* Nếu (Khách trả < Tiền hàng) thì khoản nợ sẽ được tự động tạo và cộng vào dư nợ hiện tại của khách hàng.";
  const ps1 =
    "* Nếu (Khách trả > Tiền hàng) và khách hàng có nhu cầu lấy khoản tiền dư trả vào nợ hiện tại thì dư nợ hiện tại của khách hàng sẽ tự động trừ đi khoản tiền dư.";

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      setLoading(true);
      try {
        const response = await SaleInvoiceAPI.GetById(sourceId);
        setInvoiceDetail(response.data);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        // Xử lý lỗi tại đây, ví dụ: thông báo lỗi cho người dùng
      } finally {
        setLoading(false);
      }
    };

    if (sourceId) {
      fetchInvoiceDetail();
    }
  }, [sourceId]);

  const renderTypeTag = (recordType) => {
    if (recordType === "SALE_INVOICE") {
      return <Tag color="red">NỢ</Tag>;
    } else if (recordType === "PAYMENT") {
      return <Tag color="green">TRẢ</Tag>;
    }
  };

  const renderDebtAmount = (recordType, totalPrice, pricePaid) => {
    const amount =
      recordType === "SALE_INVOICE"
        ? totalPrice - pricePaid
        : pricePaid - totalPrice;
    const color = recordType === "SALE_INVOICE" ? "red" : "green";
    return (
      <span style={{ fontWeight: "bold", color }}>
        {amount.toLocaleString()} đ
      </span>
    );
  };

  return (
    <Modal
      title="Từ hóa đơn"
      visible={isVisible}
      onCancel={onClose}
      onOk={onClose}
      width={600}
      height={650}
      centered
    >
      {loading ? (
        <Spin />
      ) : invoiceDetail ? (
        <>
          <Descriptions style={{ marginTop: 10 }} bordered column={1}>
            <Descriptions.Item label="Hóa đơn">
              {invoiceDetail.id}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày lập">{recordDate}</Descriptions.Item>
            <Descriptions.Item label="Loại nợ">
              {renderTypeTag(recordType)}
            </Descriptions.Item>
            <Descriptions.Item label="Tiền hàng">
              <span style={{ fontWeight: "bold" }}>
                {invoiceDetail.totalPrice?.toLocaleString()} đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nợ cũ (Tại thời điểm lập hóa đơn)">
              <span style={{ fontWeight: "bold", color: "red" }}>
                {invoiceDetail.oldDebt?.toLocaleString()} đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <span style={{ fontWeight: "bold" }}>
                {invoiceDetail.totalPayment?.toLocaleString()} đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Khách trả">
              <span style={{ fontWeight: "bold", color: "green" }}>
                {invoiceDetail.pricePaid?.toLocaleString()} đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                recordType === "SALE_INVOICE"
                  ? "Khoản nợ được tạo (Khách trả < Tiền hàng)"
                  : "Khoản nợ được trả (Khách trả > Tiền hàng)"
              }
            >
              {renderDebtAmount(
                recordType,
                invoiceDetail.totalPrice,
                invoiceDetail.pricePaid
              )}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Lý do">
            {invoiceDetail.reason || "N/A"}
          </Descriptions.Item> */}
            {/* Thêm các mô tả khác tùy theo cấu trúc dữ liệu của bạn */}
          </Descriptions>
          <p style={{ marginTop: 20, fontStyle: "italic" }}>
            {ps}
            <br></br>
            {ps1}
          </p>
        </>
      ) : (
        <p>Không tìm thấy thông tin chi tiết hóa đơn.</p>
      )}
    </Modal>
  );
};

export default SaleInvoiceDetailModal;
