import React, { useEffect, useState } from "react";
import {
  Layout,
  Switch,
  Input,
  Pagination,
  Button,
  Tooltip,
  Row,
  Col,
  Card,
  Table,
  Dropdown,
  Menu,
  Tag,
  notification,
  AutoComplete,
} from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import "./ImportInvoice.css";
import SelectSupplierModal from "./SelectSupplierModal";
import SelectProductImportModal from "./SelectProductImportModal";
import PayButtonModal from "./PayButtonModal";
import StorageLocationAPI from "../../api/StorageLocationAPI";
import StoreAPI from "../../api/StoreAPI";
import ProductAPI from "../../api/ProductAPI";

const styles = {
  smallCardHeader: {
    fontSize: "13px",
    padding: "10px 16px",
  },
};

const ImportProductView = ({ tabKey }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [importedProducts, setImportedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [oldSupplierDebt, setOldSupplierDebt] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [storageLocations, setStorageLocations] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //
  const defaultTabState = {
    selectedSupplier: null,
    importedProducts: [],
    editingProduct: null,
    oldSupplierDebt: 0,
    totalPrice: 0,
    isPayModalVisible: false,
  };
  // 2. Hàm để lưu trạng thái vào localStorage
  const saveTabState = (tabKey, state) => {
    const tabStates = JSON.parse(localStorage.getItem("tabStates")) || {};
    tabStates[tabKey] = state;
    localStorage.setItem("tabStates", JSON.stringify(tabStates));
  };
  // 3. Hàm để lấy trạng thái từ localStorage
  const getTabState = (tabKey) => {
    const tabStates = JSON.parse(localStorage.getItem("tabStates")) || {};
    return tabStates[tabKey] || { ...defaultTabState };
  };
  useEffect(() => {
    const restoredTabState = getTabState(tabKey); // tabKey là key của tab hiện tại
    // Khôi phục trạng thái cho tab này
    setSelectedSupplier(restoredTabState.selectedSupplier);
    setImportedProducts(restoredTabState.importedProducts);
    setEditingProduct(restoredTabState.editingProduct);
    setOldSupplierDebt(restoredTabState.oldSupplierDebt);
    setTotalPrice(restoredTabState.totalPrice);
    setIsPayModalVisible(restoredTabState.isPayModalVisible);
  }, [tabKey]);

  //
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      // Assuming you have an API or method to search products by name or other attributes
      ProductAPI.GetByNameContain(value).then((response) => {
        setSearchResults(response.data); // Update with actual API response
      });
    } else {
      setSearchResults([]); // Clear search results
    }
  };
  //
  const onSelectProduct = (value, option) => {
    // Option contains the selected product's information
    // Assuming option contains a 'product' object
    const product = option.product;
    handleReceiveProductDetail(product); // Use your existing function to handle adding the product
  };
  // fetch storage list
  useEffect(() => {
    StorageLocationAPI.GetAll()
      .then((response) => {
        // Assuming the response is an array of products
        setStorageLocations(response.data);
      })
      .catch((error) => {
        // Handle the error appropriately
        console.error("Error fetching products:", error);
      });
    console.log(storageLocations);
  }, []);
  //
  useEffect(() => {
    // Cập nhật totalPrice mỗi khi importedProducts thay đổi
    const newTotalPrice = importedProducts.reduce((sum, product) => {
      return sum + product.quantityKg * product.unitPrice;
    }, 0);

    setTotalPrice(newTotalPrice);
  }, [importedProducts]); // Phụ thuộc vào importedProducts

  //// Hiển thị Modal thanh toán
  const showPayModal = () => {
    setIsPayModalVisible(true);
  };

  // Ẩn Modal thanh toán
  const handlePayCancel = () => {
    setIsPayModalVisible(false);
  };

  // Function to handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };
  const showProductModal = () => {
    setIsProductModalVisible(true);
  };
  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelProductModal = () => {
    setIsProductModalVisible(false);
  };
  // selected Supplier
  const handleSupplierSelected = (supplier) => {
    console.log("Selected Supplier:", supplier);
    setSelectedSupplier(supplier);
    setOldSupplierDebt(supplier.totalDebt || 0);
    // Handle the selected supplier (e.g., store it in state)
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      selectedSupplier: supplier,
      oldSupplierDebt: supplier.totalDebt || 0,
    });
  };
  // handle recieve product
  const handleReceiveProductDetail = (productDetail) => {
    // Kiểm tra xem sản phẩm đã được thêm vào danh sách chưa
    const isProductExist = importedProducts.some(
      (product) => product.id === productDetail.id
    );

    if (isProductExist) {
      // Hiển thị thông báo lỗi
      notification.error({
        message: "Lỗi",
        description: "Sản phẩm đã được chọn!",
      });
      return; // Ngừng xử lý nếu sản phẩm đã tồn tại trong danh sách
    }

    const newProduct = {
      ...productDetail,
      key: productDetail.id,
      unit: "Kg",
      storageLocationId: "",
      storageLocationName: "",
      bag_packing: parseFloat(productDetail.bag_packing), // Đảm bảo chuyển đổi này
    };
    setEditingProduct(newProduct);
    setImportedProducts([...importedProducts, newProduct]);

    saveTabState(tabKey, {
      ...getTabState(tabKey),
      importedProducts: [...importedProducts, newProduct],
    });
  };
  //edit
  const edit = (record) => {
    setEditingProduct({ ...record });
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      editingProduct: record,
    });
  };
  //save
  const save = () => {
    const index = importedProducts.findIndex(
      (item) => item.key === editingProduct.key
    );

    if (index > -1) {
      // Tính toán lại tổng tiền
      const updatedTotalPrice =
        editingProduct.quantityKg * editingProduct.unitPrice;

      // Cập nhật sản phẩm trong danh sách
      const updatedProducts = [...importedProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantityKg: editingProduct.quantityKg,
        unitPrice: editingProduct.unitPrice,
        totalPrice: updatedTotalPrice,
      };
      setImportedProducts(updatedProducts);
    }

    // Đặt lại trạng thái chỉnh sửa
    setEditingProduct(null);

    saveTabState(tabKey, {
      ...getTabState(tabKey),
      importedProducts,
      editingProduct: null,
    });
  };
  // cancel
  const cancel = () => {
    setEditingProduct(null);
    saveTabState(tabKey, { ...getTabState(tabKey), editingProduct: null });
  };
  //
  const handleEditChangee = (e, fieldName, recordKey) => {
    const newValue = parseFloat(e.target.value) || 0; // Sử dụng giá trị mặc định là 0 nếu không phải là số

    const newProducts = importedProducts.map((product) => {
      if (product.key === recordKey) {
        const packingRatio = parseFloat(product.bag_packing) || 1; // Sử dụng giá trị mặc định là 1 nếu không phải là số
        const updatedProduct = { ...product };

        if (fieldName === "quantityKg") {
          updatedProduct.quantityKg = newValue;
          updatedProduct.quantityBag = newValue / packingRatio;
        } else if (fieldName === "unitPrice") {
          updatedProduct.unitPrice = newValue;
        }

        updatedProduct.totalPrice =
          updatedProduct.quantityKg * updatedProduct.unitPrice;

        // Cập nhật editingProduct nếu đang chỉnh sửa sản phẩm này
        if (editingProduct && editingProduct.key === recordKey) {
          setEditingProduct(updatedProduct);
          saveTabState(tabKey, {
            ...getTabState(tabKey),
            editingProduct: updatedProduct,
          });
        }

        return updatedProduct;
      }
      return product;
    });
  };

  //
  const resetInvoiceData = () => {
    setSelectedSupplier(null);
    setImportedProducts([]);
    setEditingProduct(null);
    setOldSupplierDebt(0);
    setTotalPrice(0);
    setIsPayModalVisible(false);
    // Cập nhật thêm các trường khác cần reset nếu có

    saveTabState(tabKey, { ...defaultTabState });
  };
  //

  const handlePaymentSubmit = (pricePaid) => {
    //
    // Kiểm tra xem có sản phẩm nào chưa chọn storage location hay không
    const isAllStorageLocationSelected = importedProducts.every(
      (product) => product.storageLocationId
    );

    if (!isAllStorageLocationSelected) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn vị trí lưu trữ cho tất cả sản phẩm.",
      });
      return; // Ngăn chặn gọi API nếu có sản phẩm chưa chọn vị trí lưu trữ
    }
    //
    if (importedProducts.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng thêm sản phẩm vào danh sách nhập hàng.",
      });
      return; // Ngăn chặn việc thực hiện tiếp theo nếu không có sản phẩm nào
    }

    // Kiểm tra xem có chọn nhà cung cấp chưa
    if (!selectedSupplier) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn nhà cung cấp.",
      });
      return; // Ngăn chặn việc thực hiện tiếp theo nếu chưa chọn nhà cung cấp
    }
    // Tạo danh sách productDetails dựa trên importedProducts
    const productDetails = importedProducts.map((product) => ({
      productId: product.id, // Giả định rằng mỗi sản phẩm có id
      quantity: product.quantityKg,
      importPrice: product.unitPrice,
      storageLocationId: product.storageLocationId,
    }));

    // Tạo request cho API
    const importInvoiceRequest = StoreAPI.createImportProductInvoiceRequest(
      selectedSupplier.id, // Giả định rằng selectedSupplier có id
      productDetails,
      pricePaid
    );

    // Gửi request tạo hóa đơn nhập hàng
    StoreAPI.createImportProductInvoice(importInvoiceRequest)
      .then((response) => {
        console.log("Invoice created successfully:", response);
        resetInvoiceData(); // Reset dữ liệu khi thành công
        notification.success({
          message: "Hóa đơn nhập hàng đã được tạo thành công!",
        });
        // Xử lý thêm nếu cần (ví dụ: thông báo thành công, làm mới trang, v.v.)
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
        notification.error({
          message: "Có lỗi xảy ra khi tạo hóa đơn nhập hàng!",
        });

        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
      });
  };
  // Hàm xử lý chọn vị trí lưu trữ
  const handleSelectStorageLocation = (
    productKey,
    locationId,
    locationName
  ) => {
    const newProducts = importedProducts.map((product) =>
      product.key === productKey
        ? {
            ...product,
            storageLocationId: locationId,
            storageLocationName: locationName,
          }
        : product
    );
    setImportedProducts(newProducts);
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      importedProducts: newProducts,
    });
  };
  //
  const handleDeleteProduct = (productKey) => {
    const filteredProducts = importedProducts.filter(
      (product) => product.key !== productKey
    );
    setImportedProducts(filteredProducts);
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      importedProducts: filteredProducts,
    });
  };
  //

  const handleReset = () => {
    resetInvoiceData();
    // Bạn có thể thêm các hành động khác ở đây nếu cần
  };

  // Function to handle "HĐ gần đây" action
  const handleRecentInvoices = () => {
    // Lấy 10 hóa đơn gần đây nhất
    // Bạn cần thêm logic hoặc gọi API ở đây để lấy dữ liệu
    // Hiển thị dữ liệu, có thể trong trang mới hoặc modal
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: "20%",
      editable: false,
      key: "productName",
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      width: "5%",
      editable: false,
      key: "unit",
    },
    {
      title: "Kg",
      dataIndex: "quantityKg",
      key: "quantityKg",
      width: "15%",
      render: (text, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <Input
            defaultValue={text} // Sử dụng defaultValue thay vì value
            onChange={(e) => handleEditChangee(e, "quantityKg", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "15%",
      render: (text, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <Input
            defaultValue={text} // Sử dụng defaultValue thay vì value
            onChange={(e) => handleEditChangee(e, "unitPrice", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      width: "15%",
      editable: false,
      key: "totalPrice",
    },

    {
      title: "Vị trí",
      key: "storageLocation",
      width: "12%",
      editable: true,
      render: (text, record) => {
        const menu = (
          <Menu>
            {storageLocations.map((location) => (
              <Menu.Item
                key={location.id}
                onClick={() =>
                  handleSelectStorageLocation(
                    record.key,
                    location.id,
                    location.locationName
                  )
                }
              >
                {location.locationName}
              </Menu.Item>
            ))}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {record.storageLocationName ? (
                <Tag color="blue">{record.storageLocationName}</Tag>
              ) : (
                "Select Location"
              )}
              <DownOutlined />
            </a>
          </Dropdown>
        );
      },
    },
    {
      title: "",
      dataIndex: "edit",
      render: (_, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <span>
            <Button size="small" onClick={save} style={{ marginRight: 8 }}>
              Lưu
            </Button>
            <Button size="small" onClick={cancel}>
              Hủy
            </Button>
          </span>
        ) : (
          <Button
            type="primary"
            size="small"
            disabled={editingProduct !== null}
            onClick={() => edit(record)}
          >
            Edit
          </Button>
        );
      },
    },
    {
      title: "",
      key: "delete",
      render: (_, record) => (
        <Button
          size="small"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => handleDeleteProduct(record.key)}
        >
          Xóa
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div>
        {/* Row 1 */}
        <Row gutter={[16, 16]}>
          {/* 70% Column: Table */}
          <Col span={18}>
            <AutoComplete
              style={{ width: "100%", marginBottom: 8 }}
              value={searchValue}
              onSearch={handleSearch}
              onSelect={onSelectProduct}
              placeholder="Search for products..."
              options={searchResults.map((product) => ({
                value: product.id,
                label: product.productName,
                product: product, // Pass the whole product object to use when selected
              }))}
            />
            {/* <Card style={{ padding: 0, marginBottom: 16 }}> */}
            <Table dataSource={importedProducts} columns={columns} />
            {/* </Card> */}
          </Col>

          {/* 30% Column: Divided into three parts */}
          <Col span={6}>
            <div>
              <Button
                style={{ marginBottom: 10 }}
                type="primary"
                size="small"
                onClick={showPayModal}
              >
                Thanh toán
              </Button>
              <Button
                style={{
                  marginBottom: 10,
                  backgroundColor: "red",
                  color: "white",
                }}
                size="small"
                onClick={handleReset}
              >
                Thiết lập lại
              </Button>
              <Button
                style={{
                  marginBottom: 10,
                  backgroundColor: "green",
                  color: "white",
                }}
                size="small"
                onClick={handleRecentInvoices}
              >
                HĐ gần đây
              </Button>
            </div>
            <Card
              title="Tổng mặt hàng"
              headStyle={{
                backgroundColor: "#1890ff",
                color: "white",
                ...styles.smallCardHeader,
              }}
              style={{ marginBottom: 0 }}
            >
              <div className="info-item">
                <strong>Tổng mặt hàng:</strong> {importedProducts.length}
              </div>
              <div className="info-item">
                <strong>Nợ cũ:</strong> {oldSupplierDebt}
              </div>
              <div className="info-item">
                <strong>Tổng tiền:</strong> {totalPrice}
              </div>
            </Card>

            {/* Thông tin nhà cung cấp Card */}
            <Card
              title={
                <div>
                  <span style={{ marginRight: 8 }}>Nhà cung cấp</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                  ></Button>
                </div>
              }
              headStyle={{
                backgroundColor: "#1890ff",
                color: "white",
                ...styles.smallCardHeader,
              }}
              style={{ marginBottom: 16 }}
            >
              {selectedSupplier ? (
                <div>
                  <div className="info-item">
                    <strong>Nhà cung cấp:</strong>{" "}
                    {selectedSupplier.supplierName}
                  </div>
                  <div className="info-item">
                    <strong>Điện thoại:</strong> {selectedSupplier.phoneNumber}
                  </div>
                  <div className="info-item">
                    <strong>Địa chỉ:</strong> {selectedSupplier.address}
                  </div>
                  {/* Other supplier details */}
                </div>
              ) : (
                <div>Chọn nhà cung cấp</div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
      <SelectSupplierModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSupplierSelect={handleSupplierSelected}
        footer={null}
      />
      <SelectProductImportModal
        isVisible={isProductModalVisible}
        onCancel={handleCancelProductModal}
        onAddProduct={handleReceiveProductDetail}
        footer={null}
      />
      <PayButtonModal
        isVisible={isPayModalVisible}
        onCancel={handlePayCancel}
        oldDebt={oldSupplierDebt}
        totalPrice={totalPrice}
        importedProducts={importedProducts}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default ImportProductView;
