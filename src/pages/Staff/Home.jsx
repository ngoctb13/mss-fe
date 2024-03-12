import React, { useState } from "react";

import { Layout, Card } from "antd";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
const { Content } = Layout;

const { Meta } = Card;
const Home = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <div></div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
