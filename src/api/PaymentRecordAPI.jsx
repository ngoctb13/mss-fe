import axiosClient from "./axiosClient";
const PaymentRecordAPI = {
  payDebt: (paymentReq) => {
    const url = `/payment-record/pay-debt`;
    return axiosClient.post(url, paymentReq);
  },
};
export default PaymentRecordAPI;
