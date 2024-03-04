import React, { useState } from "react";

import { Link } from "react-router-dom";
import {
  Layout,
  Switch,
  Input,
  Pagination,
  Button,
  Tooltip,
  Row,
  Col,
  Card,
} from "antd";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
const { Content } = Layout;

const { Meta } = Card;
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const data = new Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Cửa hàng ${index + 1}`,
    description: `Mô tả cửa hàng ${index + 1}`,
    imageUrl:
      "https://gaogiasi.com/wp-content/uploads/2020/09/z2035105732201_ffa65e29596b50ff298c086a32a72084.jpg",
  }));

  const pageSize = 5;
  const currentData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
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
