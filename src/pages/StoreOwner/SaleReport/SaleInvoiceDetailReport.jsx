import React, { useState } from "react";
import { Layout } from "antd";

import OwnerSidebar from "../../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../../components/layout/Header";
import AppFooter from "../../../components/layout/Footer";
import SaleInvoiceDetail from "../../../components/InvoiceReport/SaleInvoiceDetail";
import PageTitle from "../../../components/layout/PageTitle";
const { Content } = Layout;

const SaleInvoiceDetailReport = () => {
  const pageTitle = "Chi tiết bán hàng";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 5 }}>
          <SaleInvoiceDetail />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default SaleInvoiceDetailReport;
