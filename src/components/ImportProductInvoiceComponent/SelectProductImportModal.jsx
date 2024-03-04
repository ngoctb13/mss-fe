import React, { useState } from "react";
import { Modal, Input, Table, Button } from "antd";
import Search from "antd/es/input/Search";

const longProductList = [];
for (let i = 1; i <= 100; i++) {
  longProductList.push({
    id: i,
    productName: `Product ${i}`,
    unit: `Kg`,
    importPice: `12345${i}`,
    description: `description product ${i}`,
    inventory: `12${i}`,
    bag_packing: `50`,
  });
}

const SelectProductImportModal = ({ isVisible, onCancel }) => {
  // Danh sách sản phẩm mẫu
  const [productList, setProductList] = useState(longProductList);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    importPrice: 0,
    inventory: 0,
  });

  const handleProductSelect = (product) => {
    setSelectedProduct({
      productName: product.productName,
      importPrice: product.retailPrice,
      inventory: product.inventory,
    });
  };
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: "20%",
      key: "productName",
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      width: "5%",
      key: "unit",
    },
    {
      title: "Quy cách",
      dataIndex: "bag_packing",
      width: "5%",
      key: "bag_packing",
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      width: "5%",
      key: "importPrice",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "10%",
      key: "description",
    },
  ];
  return (
    <Modal
      title="Chọn sản phẩm"
      visible={isVisible}
      centered
      onCancel={onCancel}
      width={1000}
      height={650}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={selectedProduct.productName}
          name="search"
          enterButton
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "70%", marginRight: 16 }}>
          <Table
            dataSource={productList} // Đổi products thành danh sách sản phẩm
            columns={columns} // Định nghĩa cột cho bảng
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleProductSelect(record),
            })}
            scroll={{ y: 400 }}
          />
        </div>
        <div style={{ flex: "30%" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              SL bao:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng bao muốn nhập (SL bao)"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>SL Kg:</label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng kg muốn nhập (Số kg)"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              Đơn giá:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Đơn giá"
              value={selectedProduct.importPrice}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              SL tồn:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng tồn kho"
              value={selectedProduct.inventory}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectProductImportModal;
