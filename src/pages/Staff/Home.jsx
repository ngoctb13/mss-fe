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
          <Row gutter={16}>
            <Col span={8}>
              <Card
                hoverable
                title="Quản lý phân kho"
                extra={
                  <Link to="/staff/storage-zone">
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
                  <Link to="/personal-info">
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
