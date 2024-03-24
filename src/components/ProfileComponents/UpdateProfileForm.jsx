import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import {
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserAPI from "../../api/UserAPI";
import UserProfileAPI from "../../api/UserProfileAPI";
import moment from "moment";

const { Option } = Select;

const UpdateProfileForm = () => {
  const [form] = Form.useForm();
  const [currentUserProfile, setCurrentUserProfile] = useState({});

  useEffect(() => {
    try {
      UserProfileAPI.GetCurrentUserProfile()
        .then((response) => {
          const data = response.data;
          if (data.dateOfBirth) {
            data.dateOfBirth = moment(data.dateOfBirth, "YYYY-MM-DD");
          }
          setCurrentUserProfile(data);
          form.setFieldsValue(data); // Giả sử response trả về có trường username
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          message.error("Could not fetch user data.");
        });
    } catch (error) {
      console.error("Error decoding token:", error);
      message.error("Invalid token.");
    }
  }, []);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? moment(values.dateOfBirth).format("YYYY-MM-DD")
        : undefined,
      // Đảm bảo gender được set; bạn có thể cần logic phức tạp hơn nếu có nhiều giá trị
      gender: values.gender,
    };
    console.log("Received formattedValues of form: ", formattedValues);
    // Thêm logic cập nhật thông tin tài khoản tại đây
    UserProfileAPI.UpdateCurrentUserProfile(formattedValues)
      .then(() => {
        message.success("Thông tin cá nhân đã được cập nhật thành công.");
      })
      .catch((error) => {
        console.error("Failed to update profile", error);
        message.error("Cập nhật thông tin cá nhân thất bại.");
      });
  };
  return (
    <Form
      form={form}
      name="update_profile"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: "400px", width: "100%" }}
    >
      <Form.Item
        name="email"
        rules={[
          { type: "email", message: "Vui lòng nhập đúng định dạng E-mail!" },
        ]}
        // initialValue={currentUserProfile.email}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
          //   value={currentUserProfile.email}
        />
      </Form.Item>
      <Form.Item
        name="fullName"
        rules={[
          { min: 2, message: "Tên phải có ít nhất 2 ký tự." },
          { max: 50, message: "Tên không được vượt quá 50 ký tự." },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Họ và tên"
        />
      </Form.Item>
      <Form.Item
        name="gender"
        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
      >
        <Select
          placeholder="Giới tính"
          suffixIcon={
            <ManOutlined className="site-form-item-icon" /> // Ví dụ sử dụng icon cho mục đích biểu diễn, không phải prefix
          }
        >
          <Option value="MALE">Nam</Option>
          <Option value="FEMALE">Nữ</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="dateOfBirth"
        rules={[{ required: true, message: "Chọn ngày sinh của bạn!" }]}
      >
        <DatePicker
          suffixIcon={<CalendarOutlined />}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={[
          { pattern: /^[0-9]+$/, message: "Số điện thoại chỉ bao gồm số." },
          { min: 10, message: "Số điện thoại phải có ít nhất 10 số." },
          { max: 11, message: "Số điện thoại không được vượt quá 11 số." },
        ]}
      >
        <Input
          prefix={<PhoneOutlined className="site-form-item-icon" />}
          placeholder="Số điện thoại"
        />
      </Form.Item>
      <Form.Item
        name="identityNumber"
        rules={[
          {
            pattern: /^[0-9]+$/,
            message: "Số căn cước công dân chỉ bao gồm số.",
          },
          { len: 12, message: "Số căn cước công dân phải có 12 số." },
        ]}
      >
        <Input
          prefix={<IdcardOutlined className="site-form-item-icon" />}
          placeholder="Căn cước công dân"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfileForm;
