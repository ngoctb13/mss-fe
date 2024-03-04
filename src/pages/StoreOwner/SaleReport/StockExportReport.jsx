import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Row,
  Col,
  Spin,
  message,
  Layout,
} from "antd";

import OwnerSidebar from "../../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../../components/layout/Header";
import AppFooter from "../../../components/layout/Footer";
import StockExportReportList from "../../../components/InvoiceReport/StockExportReportList";
const { Content } = Layout;

const StockExportReport = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <StockExportReportList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default StockExportReport;
