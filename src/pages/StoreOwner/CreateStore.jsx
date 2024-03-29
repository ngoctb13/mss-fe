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
import CreateStoreForm from "../../components/Stores/CreateStoreForm";
const { Content } = Layout;

const CreateStore = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <CreateStoreForm />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default CreateStore;
