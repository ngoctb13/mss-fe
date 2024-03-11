import React, { useState } from "react";
import {
  Layout,
} from "antd";

import ImportInvoiceReportList from "../../../components/ImportInvoiceReport/ImportInvoiceReportList";
import OwnerSidebar from "../../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../../components/layout/Header";
import AppFooter from "../../../components/layout/Footer";
const { Content } = Layout;

const ImportInvoiceReport = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <ImportInvoiceReportList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default ImportInvoiceReport;
