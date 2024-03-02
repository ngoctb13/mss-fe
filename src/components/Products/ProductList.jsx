import React, { useState } from "react";

import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Layout,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateProductModal from "./CreateProductModal";
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    id: i,
    productName: `Product ${i}`,
    unit: `Kg`,
    retailPrice: `123${i}`,
    importPrice: `100${i}`,
    description: `Description product ${i}`,
    inventory: `500,${i}`,
    bag_packing: `50`,
    status: `ACTIVE`,
  });
}
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
const ProductList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
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
      productName: "",
      retailPrice: "",
      description: "",
      bag_packing: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
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
      title: "Tên hàng",
      dataIndex: "productName",
      width: "20%",
      editable: true,
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      width: "5%",
      editable: false,
    },
    {
      title: "Quy cách (Kg/Bao)",
      dataIndex: "bag_packing",
      width: "5%",
      editable: true,
    },
    {
      title: "Giá bán",
      dataIndex: "retailPrice",
      width: "10%",
      editable: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "15%",
      editable: true,
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      width: "10%",
      editable: false,
    },
    {
      title: "Action",
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
        inputType: col.dataIndex === "retailPrice" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateModal}
      >
        Tạo sản phẩm
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
      <CreateProductModal
        isVisible={isCreateModalVisble}
        onCancel={handleCreateModalCancel}
        footer={null}
      />
    </div>
  );
};
export default ProductList;
