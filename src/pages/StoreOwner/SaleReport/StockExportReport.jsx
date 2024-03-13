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
import PageTitle from "../../../components/layout/PageTitle";
const { Content } = Layout;

const StockExportReport = () => {
  const pageTitle = "Báo cáo xuất kho";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 5 }}>
          <StockExportReportList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default StockExportReport;
