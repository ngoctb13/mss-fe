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

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await AuthAPI.Register(
        values.username,
        values.password,
        values.storeName,
        values.storeAddress
      );
      console.log("Registration successful:", response);
      message.success("Registration successful!");
      // You can perform additional actions here, such as redirecting to a login page
      setLoading(false);
      <Navigate to="/login" />;
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Registration failed. Please check your inputs.");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Registration failed. Please check your inputs.");
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
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Tên đăng nhập" />
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

              {/* <Form.Item
                name="storeName"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter your store name!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Store name" />
              </Form.Item>

              <Form.Item
                name="storeAddress"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter your store address!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Store address" />
              </Form.Item> */}

              {/* <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "You must agree to the terms and conditions"
                            )
                          ),
                  },
                ]}
                // {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="">agreement</a>
                </Checkbox>
              </Form.Item> */}

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
