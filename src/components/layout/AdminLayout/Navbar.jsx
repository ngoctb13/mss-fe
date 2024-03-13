import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const AdNavbar = () => {
  return (
    <div>
      <Menu
        theme="dark"
        mode="horizontal"
        items={[
          {
            key: "1",
            label: (
              <Link to="/admin/home">
                <span style={{ float: "left" }}>Home</span>
              </Link>
            ),
          },
          {
            key: "2",
            label: (
              <Link to="/admin/users">
                <span style={{ float: "left" }}>User Manage</span>
              </Link>
            ),
          },
          {
            key: "3",
            label: (
              <Link to="/admin/stores">
                <span style={{ float: "left" }}>Store Manage</span>
              </Link>
            ),
          },
        ]}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
    </div>
  );
};

export default AdNavbar;
