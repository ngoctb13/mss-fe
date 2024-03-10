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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const tokenValid = checkTokenValidity();
      if (tokenValid) {
        return <Navigate to="/owner/home" />;
      }
      // Call the login API function from LoginAPI
      const response = await AuthAPI.Login(values.username, values.password);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userRole", response.data.role);
      const expiryTime = new Date().getTime() + TOKEN_EXPITY_TIME;
      localStorage.setItem("token_expiry", expiryTime);
      if (
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

  if (redirectToHome) {
    return <Navigate to="/owner/home" />;
  }

  if (redirectToCreateStore) {
    return <Navigate to="/owner/create-store" />;
  }
  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col>
        <Card
          title="Đăng nhập tài khoản"
          bordered={false}
          style={{ width: 300 }}
        >
          <Spin spinning={loading}>
            <Form
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
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
              <div>
                <span>
                  Bạn chưa có tài khoản?{" "}
                  <Link to={"/register"}>Đăng ký ngay!</Link>
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
