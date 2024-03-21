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
  Space,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SupplierAPI from "../../api/SupplierAPI";
import CreateSupplierModal from "./CreateSupplierModal";
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
const SupplierList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [isCreateModalVisble, setIsCreateModalVisible] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const [searchText, setSearchText] = useState("");

  const filterData = (data, searchText) => {
    return data.filter(
      (item) =>
        item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  };

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

  const createColumns = () => {
    // Các cột cơ bản
    let cols = [
      {
        title: "TT",
        key: "stt",
        width: "3%",
        render: (text, record, index) => index + 1,
        editable: false,
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "supplierName",
        width: "20%",
        editable: true,
        key: "supplierName",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        width: "15%",
        editable: true,
        key: "phoneNumber",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        width: "15%",
        editable: true,
        key: "address",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: "20%",
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
      setData(filterData(response.data, searchText));
    };

    fetchData();
  }, [searchText]);

  const onCreate = async (supplier) => {
    // Gọi API để thêm sản phẩm mới
    try {
      const response = await SupplierAPI.Create(supplier);
      // Cập nhật dữ liệu trên UI
      setData([
        ...data,
        { ...supplier, id: response.data.id, status: "ACTIVE" },
      ]);
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
      <Helmet>
        <title>Nhà cung cấp</title>
      </Helmet>
      <Space style={{ marginBottom: 16, marginTop: 20 }}>
        {userRole === "STORE_OWNER" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            Tạo nhà cung cấp
          </Button>
        )}
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
