import React, { useState } from "react";
import StoreAPI from "../../api/StoreAPI";
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

import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import ImportProductView from "../../components/ImportProductInvoiceComponent/ImportProductView";
const { Content } = Layout;

const ImportProduct = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <ImportProductView />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default ImportProduct;
