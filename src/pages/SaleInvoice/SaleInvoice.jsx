import React, { useState } from "react";
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
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppSidebar from "../../components/layout/Sidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import "../SaleInvoice/SaleInvoice.css";
import SelectCustomerModal from "./SelectCustomerModal";
import SelectProductModal from "./SelectProductModal";

const { Content } = Layout;

const SaleInvoice = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  // Function to handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };
  const showProductModal = () => {
    setIsProductModalVisible(true);
  };
  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelProductModal = () => {
    setIsProductModalVisible(false);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: "20%",
      editable: true,
      key: "customerName",
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      width: "5%",
      editable: true,
      key: "unit",
    },
    {
      title: "Bao",
      dataIndex: "bag",
      width: "5%",
      editable: true,
      key: "bag",
    },
    {
      title: "Kg",
      dataIndex: "quantity",
      width: "5%",
      editable: true,
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: "10%",
      editable: true,
      key: "unitPrice",
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      width: "10%",
      editable: true,
      key: "totalPrice",
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <div>
            {/* Row 1 */}
            <Row gutter={[16, 16]}>
              {/* Left Column */}
              <Col span={8}>
                <Card title="Thông tin hóa đơn" style={{ marginBottom: 16 }}>
                  <div className="info-item">
                    <strong>InvoiceId:</strong> ABC123
                  </div>
                  <div className="info-item">
                    <strong>CreatedAt:</strong> 2024-02-28
                  </div>
                  <div className="info-item">
                    <strong>CreatedBy:</strong> John Doe
                  </div>
                </Card>
              </Col>
              {/* Middle Column */}
              <Col span={8}>
                <Card title="Tổng mặt hàng" style={{ marginBottom: 16 }}>
                  {/* <Input addonBefore="Tổng mặt hàng" />
                  <Input addonBefore="Nợ cũ" />
                  <Input addonBefore="Tổng tiền" /> */}
                  <div className="info-item">
                    <strong>Tổng mặt hàng:</strong> 0
                  </div>
                  <div className="info-item">
                    <strong>Nợ cũ:</strong> 0.0
                  </div>
                  <div className="info-item">
                    <strong>Tổng tiền:</strong> 0
                  </div>
                </Card>
              </Col>
              {/* Right Column */}
              <Col span={8}>
                <Card
                  title={
                    <div>
                      <span style={{ marginRight: 8 }}>
                        Thông tin khách hàng
                      </span>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                      ></Button>
                    </div>
                  }
                  style={{ marginBottom: 16 }}
                >
                  {/* <Input addonBefore="Khách hàng" />
                  <Input addonBefore="Điện thoại" />
                  <Input addonBefore="Địa chỉ" />
                  <Input addonBefore="Ghi chú" /> */}
                  <div className="info-item">
                    <strong>Khách hàng:</strong> Chị Anh
                  </div>
                  <div className="info-item">
                    <strong>Điện thoại:</strong> 9999999999
                  </div>
                  <div className="info-item">
                    <strong>Địa chỉ:</strong> Hà Nội
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Row 2 */}
            <Row>
              <Col span={24}>
                <Card style={{ padding: 0 }}>
                  {/* Table grid for item list */}
                  {/* Example: */}
                  <Table
                    //   dataSource={data}
                    columns={columns}
                  />
                  <Button
                    style={{ marginTop: 10 }}
                    type="primary"
                    // icon={<PlusOutlined />}
                    onClick={showProductModal}
                  >
                    Thêm sản phẩm
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
          <SelectCustomerModal
            isVisible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          />
          <SelectProductModal
            isVisible={isProductModalVisible}
            onCancel={handleCancelProductModal}
            footer={null}
          />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default SaleInvoice;
