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
import SupplierDebtNoteList from "../../components/DebtNotes/SupplierDebtNoteList";
import PageTitle from "../../components/layout/PageTitle";
const { Content } = Layout;

const SupplierDebtNote = () => {
  const pageTitle = "Sổ nợ nhà cung cấp";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <SupplierDebtNoteList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default SupplierDebtNote;
