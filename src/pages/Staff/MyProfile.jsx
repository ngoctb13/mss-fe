import React, { useState } from "react";
import StoreAPI from "../../api/StoreAPI";
import { Layout } from "antd";

import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import CustomerList from "../../components/Customers/CustomerList";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
import PageTitle from "../../components/layout/PageTitle";
import Profile from "../../components/ProfileComponents/Profile";
const { Content } = Layout;

const MyProfile = () => {
  const pageTitle = "Danh sách khách hàng";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <Profile />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};
// danh sach khach hang
export default MyProfile;
