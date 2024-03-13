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

import SaleInvoiceReportList from "../../../components/InvoiceReport/SaleInvoiceReportList";
import OwnerSidebar from "../../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../../components/layout/Header";
import AppFooter from "../../../components/layout/Footer";
import PageTitle from "../../../components/layout/PageTitle";
const { Content } = Layout;

const SaleInvoiceReport = () => {
  const pageTitle = "Báo cáo bán hàng";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 5 }}>
          <SaleInvoiceReportList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default SaleInvoiceReport;
