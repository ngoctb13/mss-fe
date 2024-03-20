import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  CalculatorOutlined,
  SnippetsOutlined,
  MenuOutlined,
  UserSwitchOutlined,
  InboxOutlined,
  DollarOutlined,
  HomeOutlined,
  EditOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
const { Sider } = Layout;
const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {},
  } = theme.useToken();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      const siderContainer = document.querySelector(".sider-container");
      if (siderContainer) {
        if (scrolled) {
          siderContainer.classList.add("scrolled");
        } else {
          siderContainer.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
    >
      <div className="demo-logo-vertical sider-container">
        <img className="sider-logo" src="" alt="" />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: (
              <Link to="../home">
                <span style={{ float: "left" }}>Trang chủ</span>
              </Link>
            ),
          },
          {
            key: "2",
            icon: <MenuOutlined />,
            label: <span style={{ float: "left" }}>Danh mục</span>,
            children: [
              {
                key: "2-1",
                icon: <InboxOutlined />,
                label: (
                  <Link to="../product">
                    <span style={{ float: "left" }}>Hàng Hóa</span>
                  </Link>
                ),
              },
              {
                key: "2-2",
                icon: <UserSwitchOutlined />,
                label: (
                  <Link to="../customer">
                    <span style={{ float: "left" }}>Khách Hàng</span>
                  </Link>
                ),
              },
              {
                key: "2-3",
                icon: <UsergroupAddOutlined />,
                label: (
                  <Link to="">
                    <span style={{ float: "left" }}>Nhà Cung Cấp</span>
                  </Link>
                ),
              },
              {
                key: "2-4",
                icon: <UserOutlined />,
                label: (
                  <Link to="">
                    <span style={{ float: "left" }}>Nhân Viên</span>
                  </Link>
                ),
              },
            ],
          },
          {
            key: "3",
            icon: <DollarOutlined />,
            label: (
              <Link to="../sale">
                <span style={{ float: "left" }}>Bán Hàng</span>
              </Link>
            ),
          },
          {
            key: "4",
            icon: <EditOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Nhập Hàng</span>
              </Link>
            ),
          },
          {
            key: "5",
            icon: <CalculatorOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Thu Chi</span>
              </Link>
            ),
          },
          {
            key: "6",
            icon: <SnippetsOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Báo Cáo</span>
              </Link>
            ),
          },
          {
            key: "7",
            icon: <DollarOutlined />,
            label: (
                <Link to="../storageproduct">
                  <span style={{ float: "left" }}>Quản lý mặt hàng</span>
                </Link>
            ),
          },
        ]}
      />
    </Sider>
  );
};

export default AppSidebar;
