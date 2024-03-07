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
  notification,
  Popconfirm,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./SaleInvoice.css";
import SelectCustomerModal from "./SelectCustomerModal";
import SelectProductModal from "./SelectProductModal";
import PaySaleButtonModal from "./PaySaleButtonModal";
import StoreAPI from "../../api/StoreAPI";

const SaleView = ({ curentUser }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOldDebt, setCustomerOldDebt] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editingKey, setEditingKey] = useState(""); // Trạng thái key của sản phẩm đang được chỉnh sửa
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;
  //
  //// Hiển thị Modal thanh toán
  const showPayModal = () => {
    setIsPayModalVisible(true);
  };

  // Ẩn Modal thanh toán
  const handlePayCancel = () => {
    setIsPayModalVisible(false);
  };
  //
  const edit = (record) => {
    setEditingKey(record.key);
    // Set các giá trị ban đầu cho form chỉnh sửa nếu cần
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      // Tiến hành lưu các thay đổi
      // Đây là nơi bạn gọi API hoặc cập nhật trạng thái với các giá trị mới
      setEditingKey("");
    } catch (err) {
      // Xử lý lỗi nếu có
    }
  };

  // Các hàm xử lý sự kiện onChange cho các ô nhập liệu
  const handleQuantityBagChange = (quantityBag, recordKey) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.key === recordKey) {
        const newQuantityKg = quantityBag * (product.bag_packing || 1); // Giả sử mỗi bao tương đương với 'bag_packing' Kg
        return {
          ...product,
          quantityBag,
          quantityKg: newQuantityKg,
          totalPrice: newQuantityKg * product.retailPrice,
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityKgChange = (quantityKg, recordKey) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.key === recordKey) {
        const newQuantityBag = quantityKg / (product.bag_packing || 1); // Đảo ngược quy tắc tính SL bao
        return {
          ...product,
          quantityKg,
          quantityBag: newQuantityBag,
          totalPrice: quantityKg * product.retailPrice,
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  const handlePriceChange = (retailPrice, recordKey) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.key === recordKey) {
        return {
          ...product,
          retailPrice,
          totalPrice: product.quantityKg * retailPrice,
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };
  //
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
  //
  useEffect(() => {
    // Cập nhật totalPrice mỗi khi importedProducts thay đổi
    const newTotalPrice = selectedProducts.reduce((sum, product) => {
      return sum + product.quantityKg * product.retailPrice;
    }, 0);

    setTotalPrice(newTotalPrice);
  }, [selectedProducts]); // Phụ thuộc vào importedProducts
  // selected Supplier
  const handleCustomerSelect = (customer) => {
    console.log("Selected customer:", customer);
    setSelectedCustomer(customer);
    setCustomerOldDebt(customer.totalDebt || 0);
    // Handle the selected supplier (e.g., store it in state)
  };
  //handle add select product
  const handleAddProduct = (product) => {
    // Xử lý sản phẩm được thêm ở đây
    const isProductExist = selectedProducts.some(
      (prod) => prod.id === product.id
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
      ...product,
      key: product.id,
      unit: "Kg",
      storageLocationId: "",
      storageLocationName: "",
    };
    console.log(newProduct);
    setSelectedProducts([...selectedProducts, newProduct]);
  };
  //
  const handleDeleteProduct = (productKey) => {
    const filteredProducts = selectedProducts.filter(
      (product) => product.key !== productKey
    );
    setSelectedProducts(filteredProducts);
  };
  //
  const handleReset = () => {
    resetInvoiceData();
    // Bạn có thể thêm các hành động khác ở đây nếu cần
  };
  //
  const resetInvoiceData = () => {
    setSelectedCustomer(null);
    setSelectedProducts([]);
    setEditingKey("");
    setCustomerOldDebt(0);
    setTotalPrice(0);
    setIsPayModalVisible(false);
    // Cập nhật thêm các trường khác cần reset nếu có
  };
  //
  const handleRecentInvoices = () => {};
  //

  const handlePaymentSubmit = (pricePaid) => {
    if (selectedProducts.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng thêm sản phẩm vào danh sách mua hàng.",
      });
      return; // Ngăn chặn việc thực hiện tiếp theo nếu không có sản phẩm nào
    }

    // Kiểm tra xem có chọn nhà cung cấp chưa
    if (!selectedCustomer) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn khách hàng.",
      });
      return; // Ngăn chặn việc thực hiện tiếp theo nếu chưa chọn nhà cung cấp
    }
    // Tạo danh sách productDetails dựa trên importedProducts
    const productDetails = selectedProducts.map((product) => ({
      productId: product.id, // Giả định rằng mỗi sản phẩm có id
      quantity: product.quantityKg,
      unitPrice: product.retailPrice,
    }));

    // Tạo request cho API
    // TODO: TẠO DỮ LIỆU ĐẦU VÀO CHO API TẠO HÓA ĐƠN
    const importInvoiceRequest = StoreAPI.createSaleInvoiceRequest(
      selectedCustomer.id, // Giả định rằng selectedSupplier có id
      productDetails,
      pricePaid
    );

    // TODO: THỰC HIỆN API TẠO HÓA ĐƠN MUA HÀNG
    // Gửi request tạo hóa đơn nhập hàng
    StoreAPI.createSaleInvoice(importInvoiceRequest)
      .then((response) => {
        console.log("Invoice created successfully:", response);
        resetInvoiceData(); // Reset dữ liệu khi thành công
        notification.success({
          message: "Hóa đơn mua hàng đã được tạo thành công!",
        });
        // Xử lý thêm nếu cần (ví dụ: thông báo thành công, làm mới trang, v.v.)
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
        notification.error({
          message: "Có lỗi xảy ra khi tạo hóa đơn mua hàng!",
        });
      });
  };
  //
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: "20%",
      editable: false,
      key: "customerName",
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
      width: "10%",
      editable: true,
      key: "quantityBag",
      render: (_, record) => {
        return isEditing(record) ? (
          <Input
            value={record.quantityBag}
            onChange={(e) =>
              handleQuantityBagChange(e.target.value, record.key)
            }
          />
        ) : (
          record.quantityBag
        );
      },
    },
    {
      title: "Kg",
      dataIndex: "quantityKg",
      width: "10%",
      editable: true,
      key: "quantityKg",
      render: (_, record) => {
        return isEditing(record) ? (
          <Input
            value={record.quantityKg}
            onChange={(e) => handleQuantityKgChange(e.target.value, record.key)}
          />
        ) : (
          record.quantityKg
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "retailPrice",
      width: "10%",
      editable: true,
      key: "retailPrice",
      render: (_, record) => {
        return isEditing(record) ? (
          <Input
            value={record.retailPrice}
            onChange={(e) => handlePriceChange(e.target.value, record.key)}
          />
        ) : (
          record.retailPrice
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
      title: "",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="#"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
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
                <strong>HĐ:</strong> 23
              </div>
              <div className="info-item">
                <strong>CreatedAt:</strong> 2024-02-28
              </div>
              <div className="info-item">
                <strong>CreatedBy:</strong> ngoctb13
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
                <strong>Nợ cũ:</strong> {customerOldDebt}
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
                  <span style={{ marginRight: 8 }}>Thông tin khách hàng</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                  ></Button>
                </div>
              }
              style={{ marginBottom: 16 }}
            >
              {selectedCustomer ? (
                <div>
                  <div className="info-item">
                    <strong>Nhà cung cấp:</strong>{" "}
                    {selectedCustomer.customerName}
                  </div>
                  <div className="info-item">
                    <strong>Điện thoại:</strong> {selectedCustomer.phoneNumber}
                  </div>
                  <div className="info-item">
                    <strong>Địa chỉ:</strong> {selectedCustomer.address}
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
              <Table dataSource={selectedProducts} columns={columns} />
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
      <SelectCustomerModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onCustomerSelect={handleCustomerSelect}
        footer={null}
      />
      <SelectProductModal
        isVisible={isProductModalVisible}
        onCancel={handleCancelProductModal}
        onAddProduct={handleAddProduct}
        footer={null}
      />
      <PaySaleButtonModal
        isVisible={isPayModalVisible}
        onCancel={handlePayCancel}
        oldDebt={customerOldDebt}
        totalPrice={totalPrice}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default SaleView;
