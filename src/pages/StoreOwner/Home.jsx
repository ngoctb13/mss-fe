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
  ShoppingOutlined,
  WarehouseOutlined,
  HomeFilled,
} from "@ant-design/icons";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
const { Content } = Layout;

const Home = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <OwnerSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                hoverable
                title="Quản lý phân kho"
                extra={
                  <Link to="/owner/storage-zone">
                    <HomeFilled />
                  </Link>
                }
              >
                Quản lý tồn kho và phân phối sản phẩm.
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                title="Thông tin cá nhân"
                extra={
                  <Link to="/owner/personal-info">
                    <EditOutlined />
                  </Link>
                }
              >
                Thông tin cá nhân của bạn.
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                title="Thông tin cửa hàng"
                extra={
                  <Link to="/store-info">
                    <ShoppingOutlined />
                  </Link>
                }
              >
                Xem và chỉnh sửa thông tin cửa hàng.
              </Card>
            </Col>
          </Row>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
