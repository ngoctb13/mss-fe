import axiosClient from "./axiosClient";
const PaymentRecordAPI = {
  payDebt: (paymentReq) => {
    const url = `/payment-record/pay-debt`;
    return axiosClient.post(url, paymentReq);
  },
  GetById: (paymentRecordId) => {
    const url = `/payment-record/find-by-id/${paymentRecordId}`;
    return axiosClient.get(url);
  },
};
export default PaymentRecordAPI;
