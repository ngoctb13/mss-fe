import React, { useState } from "react";
import { Layout } from "antd";

import OwnerSidebar from "../../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../../components/layout/Header";
import AppFooter from "../../../components/layout/Footer";
import SaleInvoiceDetail from "../../../components/InvoiceReport/SaleInvoiceDetail";
const { Content } = Layout;

const SaleInvoiceDetailReport = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <SaleInvoiceDetail />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default SaleInvoiceDetailReport;
