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
  Switch,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateCustomerModal from "./CreateCustomerModal";
import CustomerAPI from "../../api/CustomerAPI";
import { Helmet } from "react-helmet";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);

  const userRole = localStorage.getItem("userRole");

  const showCreateCustomerModal = () => {
    setIsCustomerModalVisible(true);
  };
  const handleCancelCreateCustomerModal = () => {
    setIsCustomerModalVisible(false);
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      customerName: "",
      phoneNumber: "",
      address: "",
      note: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...customers];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedCustomer = { ...item, ...row };

        // Gọi API để cập nhật thông tin khách hàng
        const response = await CustomerAPI.Update(updatedCustomer);

        if (response && response.data) {
          newData.splice(index, 1, { ...response.data });
          setCustomers(newData);
          setEditingKey("");
          notification.success({
            message: "Cập nhật thành công",
            description: `Thông tin khách hàng đã được cập nhật.`,
          });
        }
      } else {
        newData.push(row);
        setCustomers(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      notification.error({
        message: "Cập nhật thất bại",
        description:
          "Không thể cập nhật thông tin khách hàng. Vui lòng thử lại.",
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CustomerAPI.GetAllByStore();
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

  const onCreate = async (customer) => {
    setLoading(true);
    try {
      const response = await CustomerAPI.Create(customer); // Gọi API để thêm khách hàng
      setLoading(false);
      if (response && response.data) {
        setCustomers([...customers, { ...customer, id: response.data.id }]);
        setIsCustomerModalVisible(false); // Đóng modal
        notification.success({
          message: "Thêm khách hàng thành công",
          description: `Bạn đã thêm thành công khách hàng ${customer.customerName}.`,
        });
      }
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Thêm khách hàng thất bại",
        description: "Có lỗi xảy ra khi thêm khách hàng. Vui lòng thử lại.",
      });
    }
  };

  const handleStatusChange = async (checked, record) => {
    try {
      const response = await CustomerAPI.Deactive(record.id);
      if (response && response.data) {
        // Cập nhật trạng thái trong danh sách customers trên frontend
        const updatedCustomers = customers.map((customer) =>
          customer.id === record.id
            ? { ...customer, status: response.data.status }
            : customer
        );
        setCustomers(updatedCustomers);

        notification.success({
          message: "Cập nhật trạng thái thành công",
          description: `Trạng thái của khách hàng đã được cập nhật thành ${response.data.status}.`,
        });
      }
    } catch (error) {
      notification.error({
        message: "Cập nhật trạng thái thất bại",
        description:
          "Đã có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.",
      });
    }
  };

  const createColumns = () => {
    // Các cột cơ bản
    let cols = [
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
        width: "15%",
        editable: true,
        key: "note",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        editable: false,
        key: "status",
        render: (_, record) => (
          <Switch
            checked={record.status === "ACTIVE"}
            onChange={
              userRole === "STORE_OWNER"
                ? (checked) => handleStatusChange(checked, record)
                : null
            }
            disabled={userRole !== "STORE_OWNER"}
          />
        ),
      },
    ];

    // Thêm cột Action nếu userRole là STORE_OWNER
    if (userRole === "STORE_OWNER") {
      cols.push({
        title: "Action",
        dataIndex: "operation",
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
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
      });
    }

    return cols;
  };

  const columns = createColumns();

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "phoneNumber" ? "number" : "text",
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
      <Helmet>
        <title>Danh Sách Khách Hàng</title>
      </Helmet>
      {userRole === "STORE_OWNER" && (
        <Button
          style={{ marginBottom: 10 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateCustomerModal}
        >
          Thêm khách hàng
        </Button>
      )}
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
        onCreate={onCreate}
      />
    </div>
  );
};

export default CustomerList;
