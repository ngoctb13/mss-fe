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
} from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import "./ImportInvoice.css";
import SelectSupplierModal from "./SelectSupplierModal";
import SelectProductImportModal from "./SelectProductImportModal";
import PayButtonModal from "./PayButtonModal";
import StorageLocationAPI from "../../api/StorageLocationAPI";
import StoreAPI from "../../api/StoreAPI";

const ImportProductView = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [importedProducts, setImportedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [oldSupplierDebt, setOldSupplierDebt] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [storageLocations, setStorageLocations] = useState([]);

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
    // Cập nhật thời gian hiện tại
    const now = new Date();
    const vietnamTime = now.toLocaleString("vi-VN", {
      hour12: false, // Sử dụng định dạng 24 giờ
      day: "2-digit", // Ngày với 2 chữ số
      month: "2-digit", // Tháng với 2 chữ số
      year: "numeric", // Năm
      hour: "2-digit", // Giờ
      minute: "2-digit", // Phút
      second: "2-digit", // Giây
    });
    setCurrentDateTime(vietnamTime);
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
      quantityBag: parseFloat(productDetail.quantityBag),
      bag_packing: parseFloat(productDetail.bag_packing), // Đảm bảo chuyển đổi này
    };
    setImportedProducts([...importedProducts, newProduct]);
  };
  //edit
  const edit = (record) => {
    setEditingProduct({ ...record });
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
        quantityBag: editingProduct.quantityBag,
        quantityKg: editingProduct.quantityKg,
        unitPrice: editingProduct.unitPrice,
        totalPrice: updatedTotalPrice,
      };
      setImportedProducts(updatedProducts);
    }

    // Đặt lại trạng thái chỉnh sửa
    setEditingProduct(null);
  };
  // cancel
  const cancel = () => {
    setEditingProduct(null);
  };
  //
  const handleEditChangee = (e, fieldName, recordKey) => {
    const newValue = parseFloat(e.target.value) || 0; // Sử dụng giá trị mặc định là 0 nếu không phải là số

    const newProducts = importedProducts.map((product) => {
      if (product.key === recordKey) {
        const packingRatio = parseFloat(product.bag_packing) || 1; // Sử dụng giá trị mặc định là 1 nếu không phải là số
        const updatedProduct = { ...product };

        if (fieldName === "quantityBag") {
          updatedProduct.quantityBag = newValue;
          updatedProduct.quantityKg = newValue * packingRatio;
        } else if (fieldName === "quantityKg") {
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
        }

        return updatedProduct;
      }
      return product;
    });

    setImportedProducts(newProducts);
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
  };
  //
  const handleDeleteProduct = (productKey) => {
    const filteredProducts = importedProducts.filter(
      (product) => product.key !== productKey
    );
    setImportedProducts(filteredProducts);
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
      title: "Bao",
      dataIndex: "quantityBag",
      key: "quantityBag",
      width: "10%",
      render: (text, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <Input
            defaultValue={text} // Sử dụng defaultValue thay vì value
            onChange={(e) => handleEditChangee(e, "quantityBag", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Kg",
      dataIndex: "quantityKg",
      key: "quantityKg",
      width: "10%",
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
      width: "10%",
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
      width: "10%",
      editable: false,
      key: "totalPrice",
    },

    {
      title: "Vị trí",
      key: "storageLocation",
      width: "10%",
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
            <Button onClick={save} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <Button
            type="primary"
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
        <Button
          style={{ marginBottom: 16, marginRight: 8 }}
          type="primary"
          onClick={showPayModal}
        >
          Thanh toán
        </Button>
        <Button
          style={{
            marginBottom: 16,
            marginRight: 8,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={handleReset}
        >
          Thiết lập lại
        </Button>
        <Button
          style={{ marginBottom: 16, backgroundColor: "green", color: "white" }}
          onClick={handleRecentInvoices}
        >
          HĐ gần đây
        </Button>
      </div>
      <div>
        {/* Row 1 */}
        <Row gutter={[16, 16]}>
          {/* Left Column */}
          <Col span={8}>
            <Card title="Thông tin hóa đơn" style={{ marginBottom: 16 }}>
              <div className="info-item">
                <strong>HĐ:</strong> 99
              </div>
              <div className="info-item">
                <strong>Ngày:</strong> {currentDateTime}
              </div>
              <div className="info-item">
                <strong>NV (Nhân viên):</strong> John Doe
              </div>
            </Card>
          </Col>
          {/* Middle Column */}
          <Col span={8}>
            <Card title="Tổng mặt hàng" style={{ marginBottom: 16 }}>
              <div className="info-item">
                <strong>Tổng mặt hàng:</strong> 0
              </div>
              <div className="info-item">
                <strong>Nợ cũ: </strong> {oldSupplierDebt}
              </div>
              <div className="info-item">
                <strong>Tổng tiền:</strong> {totalPrice}
              </div>
            </Card>
          </Col>
          {/* Right Column */}
          <Col span={8}>
            <Card
              title={
                <div>
                  <span style={{ marginRight: 8 }}>Thông tin nhà cung cấp</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                  ></Button>
                </div>
              }
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
                  {/* Add other fields as needed */}
                </div>
              ) : (
                <div>
                  <div className="info-item">
                    <strong>Nhà cung cấp:</strong>
                  </div>
                  <div className="info-item">
                    <strong>Điện thoại:</strong>
                  </div>
                  <div className="info-item">
                    <strong>Địa chỉ:</strong>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {/* Row 2 */}
        <Row>
          <Col span={24}>
            <Card style={{ padding: 0 }}>
              {/* Table grid for item list */}
              {/* Example: */}
              <Table dataSource={importedProducts} columns={columns} />
              <Button
                style={{ marginTop: 10 }}
                type="primary"
                // icon={<PlusOutlined />}
                onClick={showProductModal}
              >
                Thêm sản phẩm
              </Button>
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
