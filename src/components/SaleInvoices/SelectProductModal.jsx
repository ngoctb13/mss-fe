import React, { useEffect, useState } from "react";
import { Modal, Input, Table, Button } from "antd";
import Search from "antd/es/input/Search";
import ProductAPI from "../../api/ProductAPI";

const SelectProductModal = ({ isVisible, onCancel, onAddProduct }) => {
  // Danh sách sản phẩm mẫu
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    retailPrice: 0,
    inventory: 0,
    bag_packing: 0,
  });
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantityBags, setQuantityBags] = useState(0);
  const [quantityKg, setQuantityKg] = useState(0);
  const [retailPrice, setRetailPrice] = useState(null);
  const [priceError, setPriceError] = useState("");

  //
  const handleQuantityBagsChange = (e) => {
    const newQuantityBags = e.target.value;
    setQuantityBags(newQuantityBags);
    if (selectedProduct.bag_packing) {
      const newQuantityKg = newQuantityBags * selectedProduct.bag_packing;
      setQuantityKg(newQuantityKg);
    }
  };

  const handleQuantityKgChange = (e) => {
    const newQuantityKg = e.target.value;
    setQuantityKg(newQuantityKg);
    if (selectedProduct.bag_packing) {
      const newQuantityBags = newQuantityKg / selectedProduct.bag_packing;
      setQuantityBags(newQuantityBags);
    }
  };
  //

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductAPI.GetAll();
        setProductList(response.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Failed to fetch products", error);
        // Handle error appropriately
      }
    };

    fetchProducts();
  }, []);

  //search
  //
  useEffect(() => {
    let filtered;
    if (searchTerm.trim() === "") {
      // Nếu searchTerm chỉ là khoảng trắng, trả về toàn bộ danh sách
      filtered = productList;
    } else {
      // Nếu không, tiến hành lọc theo searchTerm
      filtered = productList.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProductList(filtered);
  }, [searchTerm, productList]);
  //

  const handleProductSelect = (product) => {
    const bagPackingValue = parseFloat(product.bag_packing);
    setSelectedProduct({
      id: product.id,
      productName: product.productName,
      retailPrice: product.retailPrice,
      inventory: product.inventory,
      bag_packing: bagPackingValue,
    });
    setSearchTerm(product.productName);
    setRetailPrice(product.retailPrice);
  };

  //
  const handleAddProduct = () => {
    const productDetail = {
      id: selectedProduct.id,
      productName: selectedProduct.productName,
      bag_packing: selectedProduct.bag_packing,
      quantityBag: quantityBags,
      quantityKg: quantityKg,
      retailPrice: retailPrice,
      totalPrice: quantityKg * retailPrice,
    };
    console.log(productDetail);
    // Gọi hàm truyền dữ liệu ra ngoài (ví dụ: thông qua callback)
    onAddProduct(productDetail);
    setSelectedProduct({
      productName: "",
      importPrice: 0,
      inventory: 0,
      bag_packing: 0,
    });
    setQuantityKg(null);
    setQuantityBags(null);
    setRetailPrice(null);
    // setBagError("");
    // setKgError("");
    setPriceError("");
    // setCanAddProduct(false);
    setSearchTerm("");
    onCancel();
  };
  //

  const handleRetailPriceChange = (e) => {
    const value = e.target.value;
    setRetailPrice(value);
    setPriceError(""); // Xóa thông báo lỗi
    setPriceError("Đơn giá không hợp lệ. Giá trị phải là số không âm.");
  };
  //
  const columns = [
    {
      title: "",
      key: "stt",
      width: "3%",
      render: (text, record, index) => index + 1,
    },
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
      title: "Giá bán",
      dataIndex: "retailPrice",
      width: "5%",
      key: "retailPrice",
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          name="search"
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "70%", marginRight: 16 }}>
          <Table
            dataSource={filteredProductList} // Đổi products thành danh sách sản phẩm
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
              placeholder="Số lượng bao muốn mua (SL bao)"
              value={quantityBags}
              onChange={handleQuantityBagsChange}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>SL Kg:</label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng kg muốn mua (Số kg)"
              value={quantityKg}
              onChange={handleQuantityKgChange}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              Đơn giá:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Đơn giá"
              value={retailPrice}
              onChange={handleRetailPriceChange}
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
            <Button type="primary" onClick={handleAddProduct}>
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectProductModal;
