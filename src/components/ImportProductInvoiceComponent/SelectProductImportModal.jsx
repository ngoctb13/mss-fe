import React, { useEffect, useState } from "react";
import { Modal, Input, Table, Button } from "antd";
import Search from "antd/es/input/Search";
import ProductAPI from "../../api/ProductAPI";

const SelectProductImportModal = ({ isVisible, onCancel, onAddProduct }) => {
  // Danh sách sản phẩm mẫu
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    importPrice: 0,
    inventory: 0,
    bag_packing: 0,
  });
  const [quantityKg, setQuantityKg] = useState(0);
  const [quantityBag, setQuantityBag] = useState(0);
  const [tempQuantityKg, setTempQuantityKg] = useState(0);
  const [tempQuantityBag, setTempQuantityBag] = useState(0);
  const [prevQuantityKg, setPrevQuantityKg] = useState(0);
  const [prevQuantityBag, setPrevQuantityBag] = useState(0);
  //
  const handleQuantityKgChange = (e) => {
    setQuantityKg(e.target.value);
  };

  const handleQuantityBagChange = (e) => {
    setQuantityBag(e.target.value);
  };
  //
  const handleKgBlur = () => {
    if (quantityKg && parseFloat(quantityKg) !== prevQuantityKg) {
      const calculatedBags = quantityKg / selectedProduct.bag_packing;
      setQuantityBag(calculatedBags || 0); // Sử dụng giá trị mặc định nếu phép tính không hợp lệ
      setPrevQuantityKg(quantityKg);
    }
  };

  const handleBagBlur = () => {
    if (quantityBag && parseFloat(quantityBag) !== prevQuantityBag) {
      const calculatedKg = quantityBag * selectedProduct.bag_packing;
      setQuantityKg(calculatedKg || 0); // Sử dụng giá trị mặc định nếu phép tính không hợp lệ
      setPrevQuantityBag(quantityBag);
    }
  };
  // fetch product list
  useEffect(() => {
    ProductAPI.GetAll()
      .then((response) => {
        // Assuming the response is an array of products
        setProductList(response.data);
      })
      .catch((error) => {
        // Handle the error appropriately
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleAddProduct = () => {
    const productDetail = {
      id: selectedProduct.id,
      productName: selectedProduct.productName,
      quantityBag: quantityBag,
      quantityKg: quantityKg,
      unitPrice: selectedProduct.importPrice,
      totalPrice: quantityKg * selectedProduct.importPrice,
    };

    // Gọi hàm truyền dữ liệu ra ngoài (ví dụ: thông qua callback)
    onAddProduct(productDetail);
    onCancel();
  };

  const handleProductSelect = (product) => {
    setSelectedProduct({
      id: product.id,
      productName: product.productName,
      importPrice: product.retailPrice,
      inventory: product.inventory,
      bag_packing: product.bag_packing,
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
              value={quantityBag}
              onChange={handleQuantityBagChange}
              onBlur={handleBagBlur}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>SL Kg:</label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng kg muốn nhập (Số kg)"
              value={quantityKg}
              onChange={handleQuantityKgChange}
              onBlur={handleKgBlur}
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
          <div>
            <Button
              type="primary"
              onClick={handleAddProduct}
              style={{ marginTop: 16 }}
            >
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectProductImportModal;
