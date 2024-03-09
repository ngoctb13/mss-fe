import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: {}, // Trạng thái lưu thông tin của tất cả các tab
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoiceData: (state, action) => {
      const { tabKey, data } = action.payload;
      state.invoices[tabKey] = data;
    },
  },
});

export const { setInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
