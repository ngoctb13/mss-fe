import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Spin, message } from "antd";
import AuthAPI from "../../api/AuthAPI";
import { MailOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./style.css";

const ForgotPasswordEmail = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await AuthAPI.ForgotPassword(email);
      console.log("Registration successful:", response);
      message.success(
        "Đường link đặt lại mật khẩu đã được gửi tới email của bạn!"
      );
      // You can perform additional actions here, such as redirecting to a login page
      setLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Vui lòng kiểm tra lại email của bạn!");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại email của bạn!");
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>Quên mật khẩu</title>
      </Helmet>
      <Col>
        <Card
          title="Quên mật khẩu"
          className="login-card"
          style={{ width: 400 }}
        >
          <Spin spinning={loading}>
            <Form
              name="registerForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                  { type: "text", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Gửi yêu cầu
                </Button>
              </Form.Item>
              <div>
                <span>
                  Bạn đã có tài khoản?{" "}
                  <Link to={"/login"}>Đăng nhập ngay!</Link>
                </span>
              </div>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPasswordEmail;
