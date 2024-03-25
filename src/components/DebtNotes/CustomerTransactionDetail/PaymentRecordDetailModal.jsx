import React, { useEffect, useState } from "react";
import SaleInvoiceAPI from "../../../api/SaleInvoiceAPI";
import { Descriptions, Modal, Spin, Tag } from "antd";
import PaymentRecordAPI from "../../../api/PaymentRecordAPI";

const PaymentRecordDetailModal = ({
  isVisible,
  recordType,
  sourceId,
  recordDate,
  onClose,
}) => {
  const [recordDetail, setRecordDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecordDetail = async () => {
      setLoading(true);
      try {
        const response = await PaymentRecordAPI.GetById(sourceId);
        setRecordDetail(response.data);
      } catch (error) {
        console.error("Error fetching record details:", error);
        // Xử lý lỗi tại đây, ví dụ: thông báo lỗi cho người dùng
      } finally {
        setLoading(false);
      }
    };

    if (sourceId) {
      fetchRecordDetail();
    }
  }, [sourceId]);

  const renderTypeTag = (recordType) => {
    if (recordType === "SALE_INVOICE") {
      return <Tag color="red">NỢ</Tag>;
    } else if (recordType === "PAYMENT") {
      return <Tag color="green">TRẢ</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết thanh toán"
      visible={isVisible}
      onCancel={onClose}
      onOk={onClose}
      width={600}
      height={650}
      centered
    >
      {loading ? (
        <Spin />
      ) : recordDetail ? (
        <Descriptions style={{ marginTop: 10 }} bordered column={1}>
          <Descriptions.Item label="Phiếu">{recordDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Ngày lập">{recordDate}</Descriptions.Item>
          <Descriptions.Item label="Loại">
            {renderTypeTag(recordType)}
          </Descriptions.Item>
          <Descriptions.Item label="Tiền trả">
            <span style={{ fontWeight: "bold", color: "green" }}>
              {recordDetail.paymentAmount?.toLocaleString()} đ
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {recordDetail.note}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không tìm thấy thông tin chi tiết giao dịch.</p>
      )}
    </Modal>
  );
};

export default PaymentRecordDetailModal;
