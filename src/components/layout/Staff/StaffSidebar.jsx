import React, { useState, useEffect } from "react";
import {
  CalculatorOutlined,
  MenuOutlined,
  DollarOutlined,
  HomeOutlined,
  EditOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const StaffSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {},
  } = theme.useToken();
  const location = useLocation();

  const findKeysForLocation = (path) => {
    const map = {
      "/staff/home": { selected: "1" },
      "/staff/products": { open: "2", selected: "2-1" },
      "/staff/customers": { open: "2", selected: "2-2" },
      "/staff/suppliers": { open: "2", selected: "2-3" },
      //   "/owner/staff-list": { open: "2", selected: "2-4" },
      //   "/owner/debt-note/customer": { open: "3", selected: "3-1" },
      //   "/owner/debt-note/supplier": { open: "3", selected: "3-2" },
      "/staff/sale-tabs": { selected: "4" },
      "/staff/import-tabs": { selected: "5" },
      "/staff/sale-report/sale-invoice-report": { open: "6", selected: "6-1" },
      "/staff/sale-report/sale-invoice-detail-report": {
        open: "6",
        selected: "6-2",
      },
      //   "/owner/sale-report/stock-export-report": { open: "6", selected: "6-3" },
      "/staff/import-report/import-invoice-report": {
        open: "7",
        selected: "7-1",
      },
    };
    return map[path] || {};
  };
  const { open, selected } = findKeysForLocation(location.pathname);

  const [openKeys, setOpenKeys] = useState(open ? [open] : []);
  const [selectedKeys, setSelectedKeys] = useState(selected ? [selected] : []);

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

  useEffect(() => {
    const { open, selected } = findKeysForLocation(location.pathname);
    if (open) setOpenKeys([open]);
    if (selected) setSelectedKeys([selected]);
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const defaultWidth = 200;
  const collapsedWidth = 50;
  const userRole = localStorage.getItem("userRole");

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      width={defaultWidth}
      collapsedWidth={collapsedWidth}
    >
      <div className="demo-logo-vertical sider-container">
        <img className="sider-logo" src="" alt="" />
      </div>
      <Menu
        theme="light"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/staff/home">Trang chủ</Link>
        </Menu.Item>
        <SubMenu key="2" icon={<MenuOutlined />} title="Danh mục">
          <Menu.Item key="2-1">
            <Link to="/staff/products">Hàng hóa</Link>
          </Menu.Item>
          <Menu.Item key="2-2">
            <Link to="/staff/customers">Khách hàng</Link>
          </Menu.Item>
          <Menu.Item key="2-3">
            <Link to="/staff/suppliers">Nhà cung cấp</Link>
          </Menu.Item>
          {/* <Menu.Item key="2-4">
            <Link to="/owner/staff-list">Nhân viên</Link>
          </Menu.Item> */}
        </SubMenu>
        {/* <SubMenu key="3" icon={<MenuOutlined />} title="Sổ nợ">
          <Menu.Item key="3-1">
            <Link to="/owner/debt-note/customer">Khách hàng</Link>
          </Menu.Item>
          <Menu.Item key="3-2">
            <Link to="/owner/debt-note/supplier">Nhà cung cấp</Link>
          </Menu.Item>
        </SubMenu> */}
        <Menu.Item key="4" icon={<DollarOutlined />}>
          <Link to="/staff/sale-tabs">Bán hàng</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<EditOutlined />}>
          <Link to="/staff/import-tabs">Nhập hàng</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default StaffSidebar;
