import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Row, Col, Spin, message } from "antd";
import AuthAPI from "../../api/AuthAPI";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, Navigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      checkTokenValidity(tokenFromUrl);
    }
    console.log(token);
  }, [location]);

  const checkTokenValidity = async (token) => {
    setLoading(true);
    try {
      const response = await AuthAPI.CheckTokenValidity(token);
      setTokenIsValid(true);
      message.success("Token hợp lệ. Bạn có thể đặt lại mật khẩu.");
    } catch (error) {
      console.error("Token Error: ", error);
      setTokenIsValid(false);
      message.error("Token không hợp lệ hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await AuthAPI.ResetPassword(token, newPassword);
      console.log("Success: ", response);
      message.success("Bạn đã đặt lại mật khẩu thành công! Hãy đăng nhập lại");
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.error("Failed: ", error);
      message.error("Có lỗi đã xảy ra!");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Có lỗi đã xảy ra!");
  };

  if (tokenIsValid === false) {
    return <Navigate to="/forgot-password" replace />;
  }

  // Nếu chưa xác định được tính hợp lệ của token, có thể hiển thị spinner hoặc thông báo chờ
  if (tokenIsValid === null) {
    return (
      <Spin spinning={true} tip="Đang kiểm tra token...">
        <div style={{ minHeight: "100vh" }}></div>
      </Spin>
    );
  }
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
        <title>Đặt lại mật khẩu</title>
      </Helmet>
      <Col>
        <Card title="Đặt lại mật khẩu" bordered={false}>
          <Spin spinning={loading}>
            <Form
              name="registerForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu một lần nữa!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu không trùng khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Lưu
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

export default ResetPassword;
