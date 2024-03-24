import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import UpdateProfileForm from "./UpdateProfileForm";
import { Col, Row } from "antd";

const Profile = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h2>Thông tin tài khoản</h2>{" "}
            {/* Giới hạn chiều rộng của form và căn giữa */}
            <ResetPasswordForm />
          </div>
        </div>
      </Col>
      <Col span={12}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h2>Thông tin cá nhân</h2>
            <UpdateProfileForm />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Profile;
