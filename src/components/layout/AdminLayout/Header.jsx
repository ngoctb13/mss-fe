import React, { useState } from "react";
import { Menu as AntMenu, Avatar, Dropdown, Layout } from "antd";
import AdNavbar from "./Navbar";
import "./style.css";

const { Header } = Layout;

const AdHeader = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleLogout = () => {
    // Notification("warning", "Good Bye!");
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }, 1000);
  };

  const menu = (
    <AntMenu>
      <AntMenu.Item key="0">
        <a href="#">Trang cá nhân</a>
      </AntMenu.Item>
      <AntMenu.Divider />
      <AntMenu.Item key="3" onClick={handleLogout}>
        Đăng xuất
      </AntMenu.Item>
    </AntMenu>
  );

  const handleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset state after animation
  };
  return (
    <div>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AdNavbar />

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
    </div>
  );
};

export default AdHeader;
