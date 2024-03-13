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
import CustomerList from "../../components/Customers/CustomerList";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
import PageTitle from "../../components/layout/PageTitle";
const { Content } = Layout;

const Customers = () => {
  const pageTitle = "Danh sách khách hàng";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <CustomerList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};
// danh sach khach hang
export default Customers;
