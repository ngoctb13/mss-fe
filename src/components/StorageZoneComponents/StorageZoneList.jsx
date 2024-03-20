import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Tag, notification } from "antd";
import StorageLocationAPI from "../../api/StorageLocationAPI";
import AddZoneModal from "./AddZoneModal";

const StorageZoneList = () => {
  const [zoneList, setZoneList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID của vị trí đang được sửa
  const [tempData, setTempData] = useState({}); // Giữ dữ liệu tạm thời khi đang sửa

  const startEdit = (id) => {
    const record = zoneList.find((item) => item.id === id);
    setEditingId(id);
    setTempData({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    try {
      // Gọi API Update với dữ liệu từ `tempData` và `id` của vị trí đang được chỉnh sửa
      const response = await StorageLocationAPI.Update(tempData, editingId);
      if (response && response.data) {
        // Cập nhật danh sách zoneList với thông tin vừa được cập nhật
        const newList = zoneList.map((item) =>
          item.id === editingId ? { ...item, ...response.data } : item
        );
        setZoneList(newList);
        // Reset trạng thái chỉnh sửa và dữ liệu tạm thời
        setEditingId(null);
        setTempData({});
        // Hiển thị thông báo thành công
        notification.success({
          message: "Cập nhật thành công",
          description: `Vị trí đã được cập nhật.`,
        });
      }
    } catch (error) {
      // Xử lý và hiển thị lỗi nếu có
      notification.error({
        message: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    const fetchStorageLocations = async () => {
      try {
        const response = await StorageLocationAPI.GetAll();
        setZoneList(response.data);
      } catch (error) {
        console.error("Failed to fetch storage locations:", error);
      }
    };
    fetchStorageLocations();
    console.table(zoneList);
  }, []);

  const handleCreate = async (values) => {
    try {
      const response = await StorageLocationAPI.Create(values);
      if (response && response.data) {
        setZoneList([...zoneList, response.data]); // Cập nhật danh sách nhân viên
        setIsModalVisible(false); // Đóng modal
        notification.success({
          message: "Tạo ví trí thành công",
          description: `Vị trí đã được thêm.`,
        });
      }
    } catch (error) {
      notification.error({
        message: "Tạo vị trí thất bại",
        description: "Có lỗi xảy ra khi tạo vị trí mới. Vui lòng thử lại.",
      });
    }
  };

  const columns = [
    {
      title: "",
      key: "stt",
      width: "4%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Vị trị",
      dataIndex: "locationName",
      key: "locationName",
      width: "25%",
      render: (text, record) => {
        if (editingId === record.id) {
          return (
            <Input
              value={tempData.locationName}
              onChange={(e) =>
                setTempData({ ...tempData, locationName: e.target.value })
              }
            />
          );
        }
        return <Tag color="green">{text}</Tag>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text, record) => {
        if (editingId === record.id) {
          return (
            <Input
              value={tempData.description}
              onChange={(e) =>
                setTempData({ ...tempData, description: e.target.value })
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "25%",
      render: (text, record) =>
        record.product === null ? (
          ""
        ) : (
          <Tag color="green">{record.product.productName}</Tag>
        ), // Và ở đây
    },
    {
      title: "",
      key: "action",
      width: "15%",
      render: (_, record) => {
        if (editingId === record.id) {
          return (
            <Space size="middle">
              <Button type="primary" onClick={saveEdit}>
                Lưu
              </Button>
              <Button onClick={cancelEdit}>Hủy</Button>
            </Space>
          );
        }
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => startEdit(record.id)}>
              Sửa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm vị trí
      </Button>
      <Table
        columns={columns}
        dataSource={zoneList}
        rowKey="id"
        size="small"
        scroll={{
          y: 500,
        }}
      />
      <AddZoneModal
        isVisible={isModalVisible}
        onCreate={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default StorageZoneList;
