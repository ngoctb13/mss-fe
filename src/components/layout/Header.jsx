import React, { useState } from "react";
import { Menu as AntMenu, Layout, Dropdown, Avatar } from "antd";
import "./style.css";
const { Header } = Layout;

const AppHeader = () => {
  const userRole = localStorage.getItem("userRole");
  const [userProfile, setUserProfile] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  // Menu for dropdown
  const menu = (
    <AntMenu>
      <AntMenu.Item key="0">
        <a href="#">Trang cá nhân</a>
      </AntMenu.Item>
      <AntMenu.Divider />
      <AntMenu.Item key="3">Đăng xuất</AntMenu.Item>
    </AntMenu>
  );

  const handleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset state after animation
  };

  return (
    <Header
      style={{
        padding: "0 24px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <h1>MSS</h1>
      </div>

      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <a
          className="ant-dropdown-link"
          onClick={handleClick}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHy4mGMZKzTHZseCVQYG9mBPJ8xDTDCzURkA&usqp=CAU"
            }
            alt={"User"}
            icon={null}
            className={isClicked ? "avatar-clicked" : ""}
            style={{ marginLeft: 8 }}
          />
        </a>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
