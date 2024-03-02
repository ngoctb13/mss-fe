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
  AccountBookOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const OwnerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {},
  } = theme.useToken();
  const location = useLocation();

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

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("products")) return "2-1";
    if (path.includes("customers")) return "2-2";
    if (path.includes("suppliers")) return "2-3";
    if (path.includes("staff-list")) return "2-4";
    if (path.includes("debt-note/customer")) return "3-1";
    if (path.includes("debt-note/supplier")) return "3-2";
    if (path.includes("sale")) return "4";
    if (path.includes("import-product")) return "5";
    if (path.includes("user-list")) return "5";
    if (path.includes("class-list")) return "6";
    if (path.includes("debt-note")) return "7";

    return "1"; // default to 'Dashboard'
  };

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
        defaultSelectedKeys={[getSelectedKey()]}
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: (
              <Link to="../owner/home">
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
                  <Link to="../owner/products">
                    <span style={{ float: "left" }}>Hàng Hóa</span>
                  </Link>
                ),
              },
              {
                key: "2-2",
                icon: <UserSwitchOutlined />,
                label: (
                  <Link to="../owner/customers">
                    <span style={{ float: "left" }}>Khách Hàng</span>
                  </Link>
                ),
              },
              {
                key: "2-3",
                icon: <UsergroupAddOutlined />,
                label: (
                  <Link to="../owner/suppliers">
                    <span style={{ float: "left" }}>Nhà Cung Cấp</span>
                  </Link>
                ),
              },
              {
                key: "2-4",
                icon: <UserOutlined />,
                label: (
                  <Link to="../owner/staff-list">
                    <span style={{ float: "left" }}>Nhân Viên</span>
                  </Link>
                ),
              },
            ],
          },
          {
            key: "3",
            icon: <AccountBookOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Sổ nợ</span>
              </Link>
            ),
            children: [
              {
                key: "3-1",
                icon: <UserSwitchOutlined />,
                label: (
                  <Link to="../owner/debt-note/customer">
                    <span style={{ float: "left" }}>Khách hàng</span>
                  </Link>
                ),
              },
              {
                key: "3-2",
                icon: <UsergroupAddOutlined />,
                label: (
                  <Link to="../owner/debt-note/supplier">
                    <span style={{ float: "left" }}>Nhà cung cấp</span>
                  </Link>
                ),
              },
            ],
          },
          {
            key: "4",
            icon: <DollarOutlined />,
            label: (
              <Link to="../owner/sale">
                <span style={{ float: "left" }}>Bán Hàng</span>
              </Link>
            ),
          },
          {
            key: "5",
            icon: <EditOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Nhập Hàng</span>
              </Link>
            ),
          },
          {
            key: "6",
            icon: <PieChartOutlined />,
            label: <span style={{ float: "left" }}>Báo cáo bán hàng</span>,
            children: [
              {
                key: "6-1",
                // icon: <InboxOutlined />,
                label: (
                  <Link to="#">
                    <span style={{ float: "left" }}>Hóa đơn bán hàng</span>
                  </Link>
                ),
              },
              {
                key: "6-2",
                // icon: <UserSwitchOutlined />,
                label: (
                  <Link to="#">
                    <span style={{ float: "left" }}>Chi tiết bán hàng</span>
                  </Link>
                ),
              },
              {
                key: "6-3",
                // icon: <UsergroupAddOutlined />,
                label: (
                  <Link to="../owner/suppliers">
                    <span style={{ float: "left" }}>Xuất kho, lợi nhuận</span>
                  </Link>
                ),
              },
            ],
          },
          {
            key: "7",
            icon: <PieChartOutlined />,
            label: <span style={{ float: "left" }}>Báo cáo nhập hàng</span>,
            children: [
              {
                key: "7-1",
                // icon: <InboxOutlined />,
                label: (
                  <Link to="#">
                    <span style={{ float: "left" }}>Hóa đơn nhập hàng</span>
                  </Link>
                ),
              },
              {
                key: "7-2",
                // icon: <UserSwitchOutlined />,
                label: (
                  <Link to="#">
                    <span style={{ float: "left" }}>Chi tiết nhập hàng</span>
                  </Link>
                ),
              },
              {
                key: "7-3",
                // icon: <UsergroupAddOutlined />,
                label: (
                  <Link to="../owner/suppliers">
                    <span style={{ float: "left" }}>Nhập kho</span>
                  </Link>
                ),
              },
            ],
          },
          {
            key: "8",
            icon: <CalculatorOutlined />,
            label: (
              <Link to="#">
                <span style={{ float: "left" }}>Thu Chi</span>
              </Link>
            ),
          },
        ]}
      />
    </Sider>
  );
};

export default OwnerSidebar;
