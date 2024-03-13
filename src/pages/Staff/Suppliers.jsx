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
import SupplierList from "../../components/Suppliers/SupplierList";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
import PageTitle from "../../components/layout/PageTitle";
const { Content } = Layout;

const Suppliers = () => {
  const pageTitle = "Nhà cung cấp";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <SupplierList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Suppliers;
