import React from "react";
import { Layout } from "antd";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import { Content } from "antd/es/layout/layout";
import AppFooter from "../../components/layout/Footer";
import Profile from "../../components/ProfileComponents/Profile";

const MyProfile = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <Profile />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MyProfile;
