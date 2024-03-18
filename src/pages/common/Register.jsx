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
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await AuthAPI.Register(
        values.username,
        values.email,
        values.password
      );
      console.log("Registration successful:", response);
      message.success("Đăng ký thành công!");
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Đăng ký thất bại! Vui lòng thử lại");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Đăng ký thất bại! Vui lòng thử lại");
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
        <title>Đăng ký tài khoản</title>
      </Helmet>
      <Col>
        <Card title="Đăng ký tài khoản" bordered={false}>
          <Spin spinning={loading}>
            <Form
              name="registerForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                  { type: "text", message: "Tên tên khoản không hợp lệ!" },
                  () => ({
                    async validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const response = await AuthAPI.CheckUsername(value);
                      console.log(response);
                      if (response.data) {
                        // Giả sử phản hồi có một trường 'exists' cho biết sự tồn tại
                        return Promise.reject(
                          new Error("Tên tài khoản đã được sử dụng!")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                  { type: "email", message: "Email không hợp lệ!" },
                  () => ({
                    async validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const response = await AuthAPI.CheckEmail(value);
                      console.log(response);
                      if (response.data) {
                        return Promise.reject(
                          new Error("Email đã được sử dụng!")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
              </Form.Item>

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
                  Đăng ký
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

export default RegisterForm;
