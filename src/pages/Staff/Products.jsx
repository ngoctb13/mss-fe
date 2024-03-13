import React from "react";
import ProductList from "../../components/Products/ProductList";
import { Layout } from "antd";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import PageTitle from "../../components/layout/PageTitle";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
const { Content } = Layout;

const Products = () => {
  const pageTitle = "Danh sách sản phẩm";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StaffSidebar />
      <Layout>
        <AppHeader />
        <PageTitle pageTitle={pageTitle} />
        <Content style={{ padding: "0px 20px", marginTop: 10 }}>
          <ProductList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Products;
