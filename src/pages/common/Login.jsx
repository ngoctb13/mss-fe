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
import { Navigate, Redirect } from "react-router-dom";
import UserAPI from "../../api/UserAPI";
import { TOKEN_EXPITY_TIME } from "../../constant/constant";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToCreateStore, setRedirectToCreateStore] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
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
        <Card title="Login" bordered={false} style={{ width: 300 }}>
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
                  { required: true, message: "Please input your username!" },
                  { type: "text", message: "Please enter a valid usename!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;
