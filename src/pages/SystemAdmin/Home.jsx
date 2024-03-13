import React from "react";
import { Layout, theme, Breadcrumb } from "antd";
import AdHeader from "../../components/layout/AdminLayout/Header";
import AdFooter from "../../components/layout/AdminLayout/Footer";

const { Content } = Layout;

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <AdHeader />
      <Content style={{ padding: "0 48px", marginTop: 10, height: 550 }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 550,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div>
      </Content>
      <AdFooter />
    </Layout>
  );
};

export default Home;
