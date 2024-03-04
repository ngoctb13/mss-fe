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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserAPI from "../../api/UserAPI";
import CreateStaffModal from "./CreateStaffModal";
import ResetPasswordStaffModal from "./ResetPasswordStaffModal";

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
        setStaffs(response.data);
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
      const updatedStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await UserAPI.UpdateStatus(record.id, updatedStatus);
      // Cập nhật trạng thái trong danh sách staffs
      const updatedStaffs = staffs.map((staff) =>
        staff.id === record.id ? { ...staff, status: updatedStatus } : staff
      );
      setStaffs(updatedStaffs);
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
        <Button type="link" onClick={() => showResetPasswordModal(record)}>
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
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateStaffModal}
      >
        Thêm nhân viên
      </Button>
      <Form form={form} component={false}>
        <Table
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
