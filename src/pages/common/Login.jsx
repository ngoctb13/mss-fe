import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import AuthAPI from "../../api/AuthAPI";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, Navigate, Redirect } from "react-router-dom";
import UserAPI from "../../api/UserAPI";
import { TOKEN_EXPITY_TIME } from "../../constant/constant";
import { Helmet } from "react-helmet";
import "./style.css";

const checkTokenValidity = () => {
  const token = localStorage.getItem("accessToken");
  const expiryTime = localStorage.getItem("token_expiry");
  return token && expiryTime && new Date().getTime() < expiryTime;
};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToCreateStore, setRedirectToCreateStore] = useState(false);
  const [redirectToStaffHome, setRedirectToStaffHome] = useState(false);
  const [redirectToAdminHome, setRedirectToAdminHome] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the login API function from LoginAPI
      const response = await AuthAPI.Login(values.username, values.password);

      // Kiểm tra trạng thái tài khoản
      if (response.data.status === "INACTIVE") {
        message.error(
          "Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin hoặc chủ cửa hàng!"
        );
        setLoading(false);
        return; // Ngừng xử lý và không lưu thông tin vào localStorage
      }

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userRole", response.data.role);
      const expiryTime = new Date().getTime() + TOKEN_EXPITY_TIME;
      localStorage.setItem("token_expiry", expiryTime);

      if (response.data.role === "SYSTEM_ADMIN") {
        setRedirectToAdminHome(true);
      } else if (response.data.role === "STAFF") {
        setRedirectToStaffHome(true);
      } else if (
        response.data.role === "STORE_OWNER" ||
        response.data.role === "STAFF"
      ) {
        const userResponse = await UserAPI.GetUserById(response.data.id);
        if (userResponse.data.storeId === null) {
          setRedirectToCreateStore(true);
        } else {
          setRedirectToHome(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Login failed. Please check your inputs.");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Login failed. Please check your inputs.");
  };

  if (redirectToAdminHome) {
    return <Navigate to="/admin/home" />;
  }

  if (redirectToStaffHome) {
    return <Navigate to="/staff/home" />;
  }

  if (redirectToHome) {
    return <Navigate to="/owner/home" />;
  }

  if (redirectToCreateStore) {
    return <Navigate to="/owner/create-store" />;
  }
  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>Đăng nhập tài khoản</title>
      </Helmet>
      <Col>
        <Card
          className="login-card"
          title="Đăng nhập tài khoản"
          // bordered={false}
          style={{ width: 400 }}
        >
          <Spin spinning={loading}>
            <Form
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ marginTop: 15 }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                  {
                    type: "text",
                    message: "Vui lòng nhập tên tài khoản hợp lệ!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng nhập
                </Button>
              </Form.Item>
              <div style={{ marginBottom: 5 }}>
                <span>
                  Bạn chưa có tài khoản?{" "}
                  <Link to={"/register"}>Đăng ký ngay!</Link>
                </span>
              </div>
              <div>
                <span>
                  Quên mật khẩu?{" "}
                  <Link to={"/forgot-password"}>Ấn vào đây!</Link>
                </span>
              </div>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;
