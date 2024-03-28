// File: PayButtonModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import "./SaleInvoice.css";
import axios from "axios";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../../constant/constant";
import { Stomp } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

const PaySaleButtonModal = ({
  isVisible,
  onCancel,
  oldDebt,
  totalPrice,
  onPaymentSubmit,
  onPaymentAndExportPdf,
}) => {
  const [modalDetails, setModalDetails] = useState({
    totalPrice: 0,
    oldDebt: 0,
    totalPayment: 0,
    pricePaid: 0,
    newDebt: 0,
  });
  const [qrCode, setQrCode] = useState(null);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    if (isVisible) {
      const prefix = Array.from({ length: 3 }, () =>
        String.fromCharCode(Math.floor(Math.random() * 26) + 65)
      ).join("");
      const rawUuid = uuidv4().replace(/-/g, "");
      const shortUuid = rawUuid.substring(0, 21);
      const id = prefix + shortUuid;
      setTransactionId(id);
    }
  }, [isVisible]);

  const showPaymentQR = async () => {
    try {
      const response = await axios.get(
        `https://vietqr.co/api/generate/acb/16763261/VIETQR.CO/${modalDetails.pricePaid}/${transactionId}`,
        {
          responseType: "arraybuffer",
        }
      );

      console.log(transactionId);
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setQrCode(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  useEffect(() => {
    let stompClient = null;
    let subscription = null;
    if (isVisible) {
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
        console.log("Connected: " + frame);

        subscription = stompClient.subscribe(
          "/topic/transaction",
          function (greeting) {
            const receivedTransaction = JSON.parse(greeting.body);
            console.log(receivedTransaction);
            console.log(transactionId.toUpperCase());
            if (
              receivedTransaction.transactionId.includes(
                transactionId.toUpperCase()
              )
            ) {
              try {
                onPaymentAndExportPdf(receivedTransaction.amount);
                setTransactionId("");
                setQrCode(null);
                setModalDetails({
                  totalPrice: 0,
                  oldDebt: 0,
                  totalPayment: 0,
                  pricePaid: 0,
                  newDebt: 0,
                });
                onCancel();
              } catch (error) {
                console.error("Thanh toán thất bại: ", error);
              }
            }
          }
        );
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [transactionId, onPaymentAndExportPdf, isVisible]);

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
    // setModalDetails((prevDetails) => ({
    //   ...prevDetails,
    //   pricePaid: 0,
    //   newDebt: prevDetails.totalPayment,
    // }));
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
    onPaymentAndExportPdf(modalDetails.pricePaid);
    onCancel(); // Đóng modal sau khi xử lý
  };

  const handleSaveNoPrint = () => {
    console.log("Lưu và không in:", modalDetails);
    onPaymentSubmit(modalDetails.pricePaid);
    onCancel(); // Đóng modal sau khi xử lý
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        title="Thanh toán"
        visible={isVisible}
        onCancel={handleModalClose}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              key="payQR"
              type="primary"
              onClick={showPaymentQR}
              style={{ margin: "0 10px" }}
            >
              Thanh toán bằng QR
            </Button>
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
        width={800}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
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
          </div>
          <div>
            {qrCode && (
              <div
                style={{
                  marginLeft: "20px",
                  display: isVisible ? "block" : "none",
                }}
              >
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "auto", height: "100%", maxHeight: "600px" }}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaySaleButtonModal;
