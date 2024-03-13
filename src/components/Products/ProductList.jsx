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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateProductModal from "./CreateProductModal";
import ProductAPI from "../../api/ProductAPI";
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
const ProductList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [isCreateModalVisble, setIsCreateModalVisible] = useState(false);

  const userRole = localStorage.getItem("userRole");

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
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedProduct = { ...item, ...row };

        console.log(updatedProduct);
        const response = await ProductAPI.Update(updatedProduct);

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

  const createColumns = () => {
    // Các cột cơ bản
    let cols = [
      {
        title: "",
        key: "stt",
        width: "3%",
        render: (text, record, index) => index + 1,
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
        title: "Còn tồn",
        dataIndex: "inventory",
        width: "9%",
        editable: false,
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
        inputType: col.dataIndex === "retailPrice" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await ProductAPI.GetAll();
      setData(response.data);
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const onCreate = async (product) => {
    // Gọi API để thêm sản phẩm mới
    try {
      const response = await ProductAPI.Create(product);
      // Cập nhật dữ liệu trên UI
      setData([...data, { ...product, id: response.data.id }]);
      setIsCreateModalVisible(false); // Đóng modal sau khi thêm thành công

      openNotificationWithIcon(
        "success",
        "Thêm sản phẩm thành công",
        `Bạn đã thêm thành công sản phẩm ${product.productName}!`
      );
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Failed to create product:", error);
      openNotificationWithIcon(
        "success",
        "Thêm sản phẩm thất bại",
        `Vui lòng kiểm tra và thử lại!`
      );
    }
  };
  return (
    <div>
      <Helmet>
        <title>Danh Sách Sản Phẩm</title>
      </Helmet>
      {userRole === "STORE_OWNER" && (
        <Button
          style={{ marginBottom: 10 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Tạo sản phẩm
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
        onCreate={onCreate}
        onCancel={handleCreateModalCancel}
        footer={null}
      />
    </div>
  );
};
export default ProductList;
