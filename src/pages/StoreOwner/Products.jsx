import React from "react";
import ProductList from "../../components/Products/ProductList";
import { Layout } from "antd";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
const { Content } = Layout;

const Products = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <ProductList />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Products;
