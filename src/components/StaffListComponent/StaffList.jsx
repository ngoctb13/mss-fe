import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Alert,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Typography,
  Button,
  notification,
  Switch,
  Space,
} from "antd";
import { PlusOutlined, SearchOutlined, LockOutlined } from "@ant-design/icons";
import UserAPI from "../../api/UserAPI";
import CreateStaffModal from "./CreateStaffModal";
import ResetPasswordStaffModal from "./ResetPasswordStaffModal";
import "./style.css";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const StaffList = () => {
  const [form] = Form.useForm();
  const [staffs, setStaffs] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateStaffModalVisible, setIsCreateStaffModalVisible] =
    useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filterData = (data, searchText) => {
    return data.filter((item) =>
      item.username.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const showResetPasswordModal = (record) => {
    setSelectedStaff(record);
    setIsResetPasswordModalVisible(true);
  };

  const showCreateStaffModal = () => {
    setIsCreateStaffModalVisible(true);
  };

  const handleCancelCreateSupplierModal = () => {
    setIsCreateStaffModalVisible(false);
  };

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...staffs];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        const updatedStaff = { ...item, ...row };
        await UserAPI.Update(updatedStaff);
        newData.splice(index, 1, updatedStaff);
        setStaffs(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserAPI.GetAllStaffs();
        setStaffs(filterData(response.data, searchText));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onCreate = async (staff) => {
    setLoading(true);
    try {
      const response = await UserAPI.CreateStaffAccount(staff);
      if (response && response.data) {
        setStaffs([...staffs, response.data]); // Cập nhật danh sách nhân viên
        setIsCreateStaffModalVisible(false); // Đóng modal
        notification.success({
          message: "Tạo nhân viên thành công",
          description: `Nhân viên ${staff.username} đã được thêm.`,
        });
      }
    } catch (error) {
      notification.error({
        message: "Tạo nhân viên thất bại",
        description: "Có lỗi xảy ra khi tạo nhân viên mới. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (record) => {
    // Gọi API để cập nhật trạng thái
    try {
      const response = await UserAPI.UpdateStatus(record.id);
      // Cập nhật trạng thái trong danh sách staffs
      if (response && response.data) {
        const updatedStaffs = staffs.map((staff) =>
          staff.id === record.id
            ? { ...staff, status: response.data.status }
            : staff
        );
        setStaffs(updatedStaffs);

        notification.success({
          message: "Cập nhật trạng thái thành công",
          description: `Trạng thái đã được cập nhật thành ${response.data.status}.`,
        });
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      notification.error({
        message: "Cập nhật trạng thái thất bại",
        description: "Có lỗi xảy ra khi cập nhật trạng thái.",
      });
    }
  };

  const handleResetPassword = async (staffId, newPassword) => {
    // Gọi API để đặt lại mật khẩu tại đây
    // Ví dụ: await UserAPI.ResetPassword(staffId, newPassword);
  };

  const columns = [
    {
      title: "TT",
      key: "stt",
      width: "5%",
      render: (text, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      width: "20%",
      editable: true,
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      width: "15%",
      editable: true,
      render: () => "********",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "10%",
      render: (_, record) => (
        <Switch
          checked={record.status === "ACTIVE"}
          onChange={() => handleToggleStatus(record)}
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          icon={<LockOutlined />}
          onClick={() => showResetPasswordModal(record)}
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            color: "#fff",
          }}
        >
          Đặt lại mật khẩu
        </Button>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16, marginTop: 20 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateStaffModal}
        >
          Thêm nhân viên
        </Button>
        <Input
          placeholder="Tìm kiếm theo tên hoặc mô tả"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          suffix={<SearchOutlined />}
        />
      </Space>
      <Form form={form} component={false}>
        <Table
          className="custom-table-header"
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={staffs}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ onChange: cancel }}
        />
      </Form>
      <CreateStaffModal
        isVisible={isCreateStaffModalVisible}
        onCreate={onCreate}
        onCancel={handleCancelCreateSupplierModal}
        // Pass other necessary props for CreateStaffModal
      />
      <ResetPasswordStaffModal
        isVisible={isResetPasswordModalVisible}
        staff={selectedStaff}
        onReset={handleResetPassword}
        onCancel={() => setIsResetPasswordModalVisible(false)}
      />
    </div>
  );
};

export default StaffList;
