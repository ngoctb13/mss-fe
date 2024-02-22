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
import AppHeader from "../components/layout/Header";
import AppSidebar from "../components/layout/Sidebar";
import AppFooter from "../components/layout/Footer";
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
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <div>
            <div>
              <Button type="primary" ghost style={{ marginLeft: 10 }}>
                Thêm Cửa Hàng
              </Button>
              {/* <Select defaultValue="" style={{ width: 120, marginLeft: 16 }}>
                                <Select.Option value="">All</Select.Option>
                                <Select.Option value="ACTIVE">Active</Select.Option>
                                <Select.Option value="INACTIVE">Inactive</Select.Option>
                            </Select> */}
              <Input.Search
                placeholder="Search for projects"
                // onSearch={handleSearch}
                style={{ marginBottom: "20px", marginLeft: 20, width: 350 }}
                enterButton={<SearchOutlined />}
              />
            </div>
            <Row gutter={[16, 16]}>
              {currentData.map((project) => (
                <Col key={project.id} span={8}>
                  <Card
                    style={{
                      margin: "10px", // Reduces space around the card
                      padding: "10px", // Reduces padding inside the card
                      fontSize: "12px", // Adjusts font size inside the card
                    }}
                    cover={
                      <img
                        alt={project.name}
                        src={project.imageUrl}
                        style={{
                          height: "130px", // Reduces the height of the cover image
                          objectFit: "cover", // Adjusts how the cover image fits into its box
                        }}
                      />
                    }
                    actions={[
                      <Button size="small" key="edit">
                        <EditOutlined />
                      </Button>,
                      <Switch
                        size="small"
                        key="switch"
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<StopOutlined />}
                      />,
                    ]}
                  >
                    <Meta
                      title={
                        <div>
                          <Link to={`#`}>{project.name}</Link>
                        </div>
                      }
                      description={
                        <Tooltip title={project.description || "N/A"}>
                          <div className="truncate">
                            {project.description || "N/A"}
                          </div>
                        </Tooltip>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.length}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
