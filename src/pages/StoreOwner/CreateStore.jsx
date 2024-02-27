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
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import StoreAPI from "../../api/StoreAPI";

const CreateStore = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await StoreAPI.Create(
        values.storeName,
        values.address,
        values.phoneNumeber
      );
      console.log("Create OK!: ", response);
      message.success("Tạo cửa hàng thành công!");
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
    <div>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col>
          <Card title="CreateStore" bordered={false} style={{ width: 500 }}>
            <Spin spinning={loading}>
              <Form
                name="createStoreForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="storeName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên cửa hàng của bạn!",
                    },
                    { type: "text", message: "Vui lòng nhập đúng định dạng!" },
                  ]}
                >
                  <Input placeholder="Tên cửa hàng" />
                </Form.Item>

                <Form.Item
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ của cửa hàng!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Địa chỉ" />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại của cửa hàng!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Số điện thoại" />
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
                    Tạo cửa hàng
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateStore;
