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
  const [quantityKg, setQuantityKg] = useState(null);
  const [quantityBag, setQuantityBag] = useState(null);
  const [tempQuantityKg, setTempQuantityKg] = useState(0);
  const [tempQuantityBag, setTempQuantityBag] = useState(0);
  const [prevQuantityKg, setPrevQuantityKg] = useState(0);
  const [prevQuantityBag, setPrevQuantityBag] = useState(0);
  const [importPrice, setImportPrice] = useState(null);
  const [bagError, setBagError] = useState(""); // Lỗi SL bao
  const [kgError, setKgError] = useState(""); // Lỗi SL Kg
  const [priceError, setPriceError] = useState(""); // Lỗi Đơn giá
  const [canAddProduct, setCanAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProductList, setFilteredProductList] = useState([]);
  //
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
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
  useEffect(() => {
    setCanAddProduct(
      selectedProduct.productName !== "" && // Có chọn sản phẩm
        quantityBag != null &&
        quantityBag > 0 && // Có nhập số lượng bao
        quantityKg != null &&
        quantityKg > 0 // Có nhập số lượng kg
    );
  }, [selectedProduct, quantityBag, quantityKg]);

  // Hàm kiểm tra số hợp lệ và giới hạn
  const isValidPositiveNumber = (value) => {
    return /^[0-9]*\.?[0-9]*$/.test(value);
  };

  //
  const handleQuantityKgChange = (e) => {
    const value = e.target.value;
    if (isValidPositiveNumber(value)) {
      setQuantityKg(value);
      setKgError(""); // Xóa thông báo lỗi
    } else {
      setKgError("SL Kg không hợp lệ. Giá trị phải là số không âm.");
    }
  };

  const handleQuantityBagChange = (e) => {
    const value = e.target.value;
    if (isValidPositiveNumber(value)) {
      setQuantityBag(value);
      setBagError(""); // Xóa thông báo lỗi
    } else {
      setBagError("SL bao không hợp lệ. Giá trị phải là số không âm.");
    }
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
  //handle import price change
  const handleImportPriceChange = (e) => {
    const value = e.target.value;
    if (isValidPositiveNumber(value)) {
      setImportPrice(value);
      setPriceError(""); // Xóa thông báo lỗi
    } else {
      setPriceError("Đơn giá không hợp lệ. Giá trị phải là số không âm.");
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
      bag_packing: selectedProduct.bag_packing,
      quantityBag: quantityBag,
      quantityKg: quantityKg,
      unitPrice: importPrice,
      totalPrice: quantityKg * importPrice,
    };

    // Gọi hàm truyền dữ liệu ra ngoài (ví dụ: thông qua callback)
    onAddProduct(productDetail);
    console.log(productDetail);
    setSelectedProduct({
      productName: "",
      importPrice: 0,
      inventory: 0,
      bag_packing: 0,
    });
    setQuantityKg(null);
    setQuantityBag(null);
    setImportPrice(null);
    setBagError("");
    setKgError("");
    setPriceError("");
    setCanAddProduct(false);
    setSearchTerm("");
    onCancel();
  };

  const handleProductSelect = (product) => {
    const bagPackingValue = parseFloat(product.bag_packing);
    setSelectedProduct({
      id: product.id,
      productName: product.productName,
      importPrice: product.importPrice,
      inventory: product.inventory,
      bag_packing: bagPackingValue,
    });
    setImportPrice(product.importPrice);
    setSearchTerm(product.productName);
  };

  const handleModalClose = () => {
    // Reset selected product and all related states
    setSelectedProduct({
      productName: "",
      importPrice: 0,
      inventory: 0,
      bag_packing: 0,
    });
    setQuantityKg(null);
    setQuantityBag(null);
    setImportPrice(null);
    setBagError("");
    setKgError("");
    setPriceError("");
    setCanAddProduct(false);
    setSearchTerm("");
    // Call the onCancel prop to close the modal
    onCancel();
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
      onCancel={handleModalClose}
      width={1000}
      height={650}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Nhập tên sản phẩm"
          // value={selectedProduct.productName}
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
              placeholder="Số lượng bao muốn nhập (SL bao)"
              value={quantityBag}
              onChange={handleQuantityBagChange}
              onBlur={handleBagBlur}
            />
            {bagError && <div style={{ color: "red" }}>{bagError}</div>}
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
            {kgError && <div style={{ color: "red" }}>{kgError}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              Đơn giá:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Đơn giá"
              value={importPrice}
              onChange={handleImportPriceChange}
            />
            {priceError && <div style={{ color: "red" }}>{priceError}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 8, fontWeight: "bold" }}>
              SL tồn:
            </label>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Số lượng tồn kho"
              value={selectedProduct.inventory}
              disabled
            />
          </div>
          <div>
            <Button
              type="primary"
              onClick={handleAddProduct}
              style={{ marginTop: 16 }}
              disabled={!canAddProduct}
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
