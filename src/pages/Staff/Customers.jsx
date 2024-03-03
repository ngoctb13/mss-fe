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
const { Content } = Layout;

const Customers = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <AppHeader />
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
