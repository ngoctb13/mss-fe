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
        <Card title="Register" bordered={false} style={{ width: 500 }}>
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
                  { required: true, message: "Please input your username!" },
                  { type: "text", message: "Please enter a valid username!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
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
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterForm;
