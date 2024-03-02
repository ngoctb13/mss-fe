import React, { useEffect, useState } from "react";
import CustomerAPI from "../../api/CustomerAPI";
import {
  Table,
  Spin,
  Alert,
  Layout,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Typography,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateStaffModal from "./CreateStaffModal";

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
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
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
  const isEditing = (record) => record.key === editingKey;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateStaffModalVisible, setIsCreateStaffModalVisible] =
    useState(false);

  const showCreateStaffModal = () => {
    setIsCreateStaffModalVisible(true);
  };
  const handleCancelCreateSupplierModal = () => {
    setIsCreateStaffModalVisible(false);
  };

  const edit = (record) => {
    form.setFieldsValue({
      username: "",
      password: "",
      status: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...staffs];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setStaffs(newData);
        setEditingKey("");
      } else {
        newData.push(row);
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
        const response = await CustomerAPI.GetAll();
        setStaffs(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      width: "20%",
      editable: true,
      key: "username",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      width: "15%",
      editable: true,
      key: "password",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "25%",
      editable: true,
      key: "status",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
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
        Thêm khách hàng
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={staffs}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <CreateStaffModal
        isVisible={isCreateStaffModalVisible}
        onCancel={handleCancelCreateSupplierModal}
      />
    </div>
  );
};

export default StaffList;
