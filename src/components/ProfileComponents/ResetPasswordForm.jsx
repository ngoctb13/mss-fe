import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, CheckOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import UserAPI from "../../api/UserAPI";
import UserProfileAPI from "../../api/UserProfileAPI";

const ResetPasswordForm = () => {
  const [username, setUsername] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub; // Sử dụng 'sub' để lấy ID người dùng

        UserAPI.GetUserById(userId)
          .then((response) => {
            const user = response.data;
            setUsername(user.username); // Giả sử response trả về có trường username
          })
          .catch((error) => {
            console.error("Failed to fetch user:", error);
            message.error("Could not fetch user data.");
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        message.error("Invalid token.");
      }
    }
  }, []);

  const onFinish = (values) => {
    if (values.password !== values.confirm) {
      message.error("The two passwords that you entered do not match!");
      return;
    }

    UserProfileAPI.ChangeCurrentUserPassword(values.password)
      .then(() => {
        form.resetFields();
        message.success("Mật khẩu đã được đổi thành công.");
      })
      .catch((error) => {
        console.error("Failed to change password", error);
        message.error("Đổi mật khẩu thất bại.");
      });
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span>username: </span>
        <strong>{username}</strong>
      </div>
      <Form name="reset_password" onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 8 ký tự." },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Mật khẩu mới"
            style={{ width: "50%" }}
          />
        </Form.Item>
        {/* Trường xác nhận mật khẩu */}
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Hai mật khẩu bạn vừa nhập không trùng nhau!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<CheckOutlined className="site-form-item-icon" />}
            placeholder="Nhập lại mật khẩu"
            style={{ width: "50%" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPasswordForm;
