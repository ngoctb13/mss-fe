// File: PayButtonModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import "./ImportInvoice.css";

const PayButtonModal = ({
  isVisible,
  onCancel,
  oldDebt,
  totalPrice,
  importedProducts,
  onPaymentSubmit,
}) => {
  const [modalDetails, setModalDetails] = useState({
    totalPrice: 0,
    oldDebt: 0,
    totalPayment: 0,
    pricePaid: 0,
    newDebt: 0,
  });

  useEffect(() => {
    const newTotalPayment = totalPrice + oldDebt;
    setModalDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: totalPrice,
      oldDebt: oldDebt,
      totalPayment: newTotalPayment,
      newDebt: newTotalPayment - prevDetails.pricePaid,
    }));
  }, [totalPrice, oldDebt]);

  const handleCustomerPayChange = (e) => {
    let customerPayValue = parseFloat(e.target.value) || 0;
    // Đảm bảo rằng giá trị khách trả không vượt quá tổng thanh toán
    if (customerPayValue > modalDetails.totalPayment) {
      customerPayValue = modalDetails.totalPayment;
    }
    setModalDetails((prevDetails) => ({
      ...prevDetails,
      pricePaid: customerPayValue,
      newDebt: prevDetails.totalPayment - customerPayValue,
    }));
  };

  const handleModalClose = () => {
    // Chỉ reset trường pricePaid về 0 khi đóng modal
    setModalDetails((prevDetails) => ({
      ...prevDetails,
      pricePaid: 0,
      newDebt: prevDetails.totalPayment,
    }));

    onCancel(); // Gọi hàm onCancel từ props để đóng modal
  };

  const handleFullPayment = () => {
    setModalDetails((prevDetails) => ({
      ...prevDetails,
      pricePaid: prevDetails.totalPayment,
      newDebt: 0,
    }));
  };

  const handleSaveAndPrint = () => {
    console.log("Lưu và in:", modalDetails);
    onCancel(); // Đóng modal sau khi xử lý
  };

  const handleSaveNoPrint = () => {
    console.log("Lưu và không in:", modalDetails);
    onPaymentSubmit(modalDetails.pricePaid);
    onCancel(); // Đóng modal sau khi xử lý
  };

  return (
    <Modal
      title="Thanh toán"
      visible={isVisible}
      onCancel={handleModalClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <Button
            key="savePrint"
            type="primary"
            onClick={handleSaveAndPrint}
            style={{ margin: "0 10px" }}
          >
            Lưu và in
          </Button>
          <Button
            key="saveNoPrint"
            onClick={handleSaveNoPrint}
            style={{ margin: "0 10px" }}
          >
            Lưu và không in
          </Button>
        </div>
      }
    >
      <div style={{ marginBottom: 20 }}>
        <Input
          addonBefore="Tổng tiền hàng"
          value={modalDetails.totalPrice}
          readOnly
          style={{ fontWeight: "bold" }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Input
          addonBefore="Nợ cũ"
          value={modalDetails.oldDebt}
          readOnly
          style={{ fontWeight: "bold" }}
        />
      </div>
      <div style={{ marginBottom: 50 }}>
        <Input
          addonBefore="Tổng thanh toán"
          value={modalDetails.totalPayment}
          readOnly
          style={{ fontWeight: "bold", color: "red" }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
        <Input
          addonBefore="Khách trả"
          name="pricePaid"
          value={modalDetails.pricePaid}
          onChange={handleCustomerPayChange}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          onClick={handleFullPayment}
          style={{ marginLeft: 10 }}
        >
          Trả đủ
        </Button>
      </div>
      <div style={{ marginBottom: 30 }}>
        <Input
          addonBefore="Còn lại"
          value={modalDetails.newDebt}
          readOnly
          style={{ fontWeight: "bold" }}
        />
      </div>
    </Modal>
  );
};

export default PayButtonModal;
