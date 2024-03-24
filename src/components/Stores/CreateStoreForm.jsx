import React, { useState } from "react";
import StoreAPI from "../../api/StoreAPI";
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
  Layout,
} from "antd";
import { Navigate } from "react-router-dom";

const CreateStoreForm = () => {
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call the registration API function from AuthAPI
      const response = await StoreAPI.Create(
        values.storeName,
        values.address,
        values.phoneNumber
      );
      console.log("Create OK!: ", response);
      message.success("Tạo cửa hàng thành công!");
      setRedirectToHome(true);
      // You can perform additional actions here, such as redirecting to a login page
      setLoading(false);
    } catch (error) {
      console.error("Create failed:", error);
      message.error(
        "Tạo cửa hàng thất bại, vui lòng kiểm tra lại thông tin đã nhập!"
      );
      setLoading(false);
    }
  };
  if (redirectToHome) {
    return <Navigate to="/owner/home" />; // Redirect if needed
  }

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
          <Card
            title="Tạo cửa hàng của bạn"
            bordered={false}
            style={{ width: 500 }}
          >
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
                    {
                      type: "text",
                      message: "Vui lòng nhập đúng định dạng!",
                    },
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

export default CreateStoreForm;
