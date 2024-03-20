import React, { useState } from "react";
import { Layout } from "antd";
import StaffSidebar from "../../../components/layout/Staff/StaffSidebar";
import AppHeader from "../../../components/layout/Header";
import PageTitle from "../../../components/layout/PageTitle";
import StorageZoneList from "../../../components/StorageZoneComponents/StorageZoneList";
import AppFooter from "../../../components/layout/Footer";

const { Content } = Layout;

const StorageZone = () => {
  const pageTitle = "Quản lý phân kho";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <StorageZoneList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default StorageZone;
