import React, { useEffect, useState } from "react";
import openNotificationWithIcon from "../notification";

import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Layout,
  Button,
  Switch,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SupplierAPI from "../../api/SupplierAPI";
import CreateSupplierModal from "./CreateSupplierModal";
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
const SupplierList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [isCreateModalVisble, setIsCreateModalVisible] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };
  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      supplierName: "",
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
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedSupplier = { ...item, ...row };

        console.log(updatedSupplier);
        const response = await SupplierAPI.Update(updatedSupplier);

        if (response && response.data) {
          newData.splice(index, 1, { ...response.data }); // Sử dụng dữ liệu trả về từ API để cập nhật
          setData(newData);
          setEditingKey("");

          openNotificationWithIcon("success", "Cập nhật thành công");
        }
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      openNotificationWithIcon(
        "error",
        "Cập nhật thất bại",
        "Vui lòng thử lại!"
      );
    }
  };

  const handleStatusChange = async (checked, record) => {
    try {
      const response = await SupplierAPI.Deactive(record.id);
      if (response && response.data) {
        // Cập nhật trạng thái trong danh sách customers trên frontend
        const updatedSuppliers = data.map((supplier) =>
          supplier.id === record.id
            ? { ...supplier, status: response.data.status }
            : supplier
        );
        setData(updatedSuppliers);

        notification.success({
          message: "Cập nhật trạng thái thành công",
          description: `Trạng thái đã được cập nhật thành ${response.data.status}.`,
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

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: "3%",
      editable: false,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      width: "20%",
      editable: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: "10%",
      editable: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "15%",
      editable: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: "10%",
      editable: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      editable: false,
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "ACTIVE"}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
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
              Lưu
            </Typography.Link>
            <Popconfirm title="Xác nhận hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Sửa
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
        inputType: col.dataIndex === "phoneNumber" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await SupplierAPI.GetAll();
      setData(response.data);
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const onCreate = async (supplier) => {
    // Gọi API để thêm sản phẩm mới
    try {
      const response = await SupplierAPI.Create(supplier);
      // Cập nhật dữ liệu trên UI
      setData([...data, { ...supplier, id: response.data.id }]);
      setIsCreateModalVisible(false); // Đóng modal sau khi thêm thành công

      openNotificationWithIcon(
        "success",
        "Thêm nhà cung cấp thành công",
        `Bạn đã thêm thành công nhà cung cấp ${supplier.supplierName}!`
      );
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Failed to create supplier:", error);
      openNotificationWithIcon(
        "error",
        "Thêm nhà cung cấp thất bại",
        `Vui lòng kiểm tra và thử lại!`
      );
    }
  };
  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateModal}
      >
        Tạo nhà cung cấp
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <CreateSupplierModal
        isVisible={isCreateModalVisble}
        onCreate={onCreate}
        onCancel={handleCreateModalCancel}
        footer={null}
      />
    </div>
  );
};
export default SupplierList;
