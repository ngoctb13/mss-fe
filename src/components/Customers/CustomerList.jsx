import React, { useEffect, useState } from "react";
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
import CreateCustomerModal from "./CreateCustomerModal";
import CustomerAPI from "../../api/CustomerAPI";

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
const CustomerList = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);

  const showCreateCustomerModal = () => {
    setIsCustomerModalVisible(true);
  };
  const handleCancelCreateCustomerModal = () => {
    setIsCustomerModalVisible(false);
  };

  const edit = (record) => {
    form.setFieldsValue({
      customerName: "",
      phoneNumber: "",
      address: "",
      note: "",
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
      const newData = [...customers];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setCustomers(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setCustomers(newData);
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
        setCustomers(response.data);
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
      title: "Tên khách hàng",
      dataIndex: "customerName",
      width: "20%",
      editable: true,
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: "15%",
      editable: true,
      key: "phoneNumber",
    },
    {
      title: "Địa chị",
      dataIndex: "address",
      width: "25%",
      editable: true,
      key: "address",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: "25%",
      editable: true,
      key: "note",
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
        inputType: col.dataIndex === "customerName" ? "number" : "text",
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
        onClick={showCreateCustomerModal}
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
          dataSource={customers}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <CreateCustomerModal
        isVisible={isCustomerModalVisible}
        onCancel={handleCancelCreateCustomerModal}
      />
    </div>
  );
};

export default CustomerList;
