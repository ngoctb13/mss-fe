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
  AutoComplete,
  Tag,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./SaleInvoice.css";
import SelectCustomerModal from "./SelectCustomerModal";
import SelectProductModal from "./SelectProductModal";
import PaySaleButtonModal from "./PaySaleButtonModal";
import StoreAPI from "../../api/StoreAPI";
import ProductAPI from "../../api/ProductAPI";
import { Helmet } from "react-helmet";
import PdfAPI from "../../api/PdfAPI";

const styles = {
  smallCardHeader: {
    fontSize: "13px",
    padding: "10px 16px",
  },
};

const SaleView = ({ tabKey }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOldDebt, setCustomerOldDebt] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [productInventories, setProductInventories] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  //
  //
  const defaultTabState = {
    selectedCustomer: null,
    selectedProducts: [],
    editingProduct: null,
    customerOldDebt: 0,
    totalPrice: 0,
    isPayModalVisible: false,
  };
  //
  // 2. Hàm để lưu trạng thái vào localStorage
  const saveTabState = (tabKey, state) => {
    const saleTabStates =
      JSON.parse(localStorage.getItem("saleTabStates")) || {};
    saleTabStates[tabKey] = state;
    localStorage.setItem("saleTabStates", JSON.stringify(saleTabStates));
  };
  // 3. Hàm để lấy trạng thái từ localStorage
  const getTabState = (tabKey) => {
    const saleTabStates =
      JSON.parse(localStorage.getItem("saleTabStates")) || {};
    return saleTabStates[tabKey] || { ...defaultTabState };
  };
  //
  useEffect(() => {
    const restoredSaleTabState = getTabState(tabKey); // tabKey là key của tab hiện tại
    // Khôi phục trạng thái cho tab này
    setSelectedCustomer(restoredSaleTabState.selectedCustomer);
    setSelectedProducts(restoredSaleTabState.selectedProducts);
    setEditingProduct(restoredSaleTabState.editingProduct);
    setCustomerOldDebt(restoredSaleTabState.customerOldDebt);
    setTotalPrice(restoredSaleTabState.totalPrice);
    setIsPayModalVisible(restoredSaleTabState.isPayModalVisible);
  }, [tabKey]);
  //
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      // Assuming you have an API or method to search products by name or other attributes
      ProductAPI.GetByContainName(value).then((response) => {
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
    handleAddProduct(product); // Use your existing function to handle adding the product
  };
  //// Hiển thị Modal thanh toán
  const showPayModal = () => {
    setIsPayModalVisible(true);
  };

  // Ẩn Modal thanh toán
  const handlePayCancel = () => {
    setIsPayModalVisible(false);
  };
  //
  const cancel = () => {
    setEditingProduct(null);
  };

  const save = () => {
    try {
      const index = selectedProducts.findIndex(
        (item) => item.key === editingProduct.key
      );

      if (editingProduct) {
        // Check if the quantity exceeds inventory
        if (editingProduct.quantityKg > productInventories[editingProduct.id]) {
          notification.error({
            message: "Lỗi",
            description: `Số lượng của sản phẩm ${editingProduct.productName} vượt quá số lượng có trong kho!`,
          });
          return; // Stop save operation
        }
      }
      if (index > -1) {
        // Tính toán lại tổng tiền
        const updatedTotalPrice =
          editingProduct.quantityKg * editingProduct.retailPrice;

        // Cập nhật sản phẩm trong danh sách
        const updatedProducts = [...selectedProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          quantityKg: editingProduct.quantityKg,
          quantityBag: editingProduct.quantityBag,
          retailPrice: editingProduct.retailPrice,
          totalPrice: updatedTotalPrice,
        };
        setSelectedProducts(updatedProducts);

        saveTabState(tabKey, {
          ...getTabState(tabKey),
          selectedProducts: updatedProducts,
          editingProduct: null,
        });
      }
      setEditingProduct(null);
    } catch (err) {
      // Xử lý lỗi nếu có
    }
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
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      selectedCustomer: customer,
      customerOldDebt: customer.totalDebt || 0,
    });
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
    };
    console.log(newProduct);
    setProductInventories({
      ...productInventories,
      [newProduct.id]: newProduct.inventory,
    });
    setEditingProduct(newProduct);
    setSelectedProducts([...selectedProducts, newProduct]);

    saveTabState(tabKey, {
      ...getTabState(tabKey),
      selectedProducts: [...selectedProducts, newProduct],
    });
  };
  //
  const edit = (record) => {
    setEditingProduct({ ...record });
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      editingProduct: record,
    });
  };
  //
  const handleDeleteProduct = (productKey) => {
    const filteredProducts = selectedProducts.filter(
      (product) => product.key !== productKey
    );
    setSelectedProducts(filteredProducts);
    saveTabState(tabKey, {
      ...getTabState(tabKey),
      selectedProducts: filteredProducts,
    });
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
    setEditingProduct(null);
    setCustomerOldDebt(0);
    setTotalPrice(0);
    setIsPayModalVisible(false);
    // Cập nhật thêm các trường khác cần reset nếu có
    saveTabState(tabKey, { ...defaultTabState });
  };
  //
  const handleRecentInvoices = () => {};
  //
  const handleDownloadPdf = async (invoiceId) => {
    PdfAPI.DownloadSaleInvoicePdfV2(invoiceId)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf"); // or dynamically set the filename
        document.body.appendChild(link);
        link.click();
        link.remove(); // Clean up after downloading
      })
      .catch((error) => {
        console.error("Error downloading the invoice PDF", error);
        // Handle the error
      });
  };
  //
  const handlePaymentAndExportPDF = (pricePaid) => {
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
        const invoiceId = response.data.id;
        handleDownloadPdf(invoiceId);
        resetInvoiceData(); // Reset dữ liệu khi thành công
        notification.success({
          message: "Hóa đơn mua hàng đã được tạo và tải xuống thành công!",
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

  const handleEditChangee = (e, fieldName, recordKey) => {
    const newValue = parseFloat(e.target.value) || 0; // Sử dụng giá trị mặc định là 0 nếu không phải là số

    const newProducts = selectedProducts.map((product) => {
      if (product.key === recordKey) {
        const packingRatio = parseFloat(product.bag_packing) || 1; // Sử dụng giá trị mặc định là 1 nếu không phải là số
        const updatedProduct = { ...product };

        if (fieldName === "quantityKg") {
          updatedProduct.quantityKg = newValue;
          updatedProduct.quantityBag = newValue / packingRatio;
        } else if (fieldName === "quantityBag") {
          updatedProduct.quantityBag = newValue;
          updatedProduct.quantityKg = newValue * packingRatio;
        } else if (fieldName === "retailPrice") {
          updatedProduct.retailPrice = newValue;
        }

        updatedProduct.totalPrice =
          updatedProduct.quantityKg * updatedProduct.retailPrice;

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
  const columns = [
    {
      title: "TT",
      key: "stt",
      width: "5%",
      render: (text, record, index) => index + 1,
      editable: false,
    },
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
      width: "10%",
      editable: true,
      key: "quantityKg",
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
      dataIndex: "retailPrice",
      width: "10%",
      editable: true,
      key: "retailPrice",
      render: (text, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <Input
            defaultValue={text} // Sử dụng defaultValue thay vì value
            onChange={(e) => handleEditChangee(e, "retailPrice", record.key)}
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
      key: "storageLocations",
      width: "15%",
      dataIndex: "storageLocations",
      render: (storageLocations) => {
        if (!storageLocations || storageLocations.length === 0) {
          return <span>N/A</span>;
        }

        const menu = (
          <Menu>
            {storageLocations.map((loc) => (
              <Menu.Item key={loc.locationName}>
                <Tooltip title={loc.description}>
                  <Tag color="blue">{loc.locationName}</Tag>
                </Tooltip>
              </Menu.Item>
            ))}
          </Menu>
        );

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Tooltip title={storageLocations[0].description}>
              <Tag color="blue">{storageLocations[0].locationName}</Tag>
            </Tooltip>
            {storageLocations.length > 1 && (
              <Dropdown overlay={menu}>
                <Button type="text" icon={<DownOutlined />} size="small" />
              </Dropdown>
            )}
          </div>
        );
      },
    },
    {
      title: " ",
      dataIndex: "action",
      width: "8%",
      render: (_, record) => {
        const isEditing = editingProduct && record.key === editingProduct.key;
        return isEditing ? (
          <span>
            <Button
              icon={<SaveOutlined />}
              onClick={save}
              style={{ color: "green" }}
            />

            <Button
              icon={<CloseOutlined />}
              onClick={cancel}
              style={{ color: "red" }}
            />
          </span>
        ) : (
          <Button
            icon={<EditOutlined />}
            disabled={editingProduct !== null}
            onClick={() => edit(record)}
            style={{ color: "orange" }}
          />
        );
      },
    },

    {
      title: " ",
      key: "delete",
      width: "5%",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          style={{ color: "red", border: "none" }}
          onClick={() => handleDeleteProduct(record.key)}
        />
      ),
    },
  ];
  return (
    <div>
      <Helmet>
        <title>Bán hàng</title>
      </Helmet>
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
            <Table
              className="custom-table-header"
              dataSource={selectedProducts}
              columns={columns}
            />
          </Col>

          {/* 30% Column: Divided into three parts */}
          <Col span={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <Button
                style={{
                  marginRight: 8,
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={handleReset}
              >
                Thiết lập lại
              </Button>
              <Button
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
                onClick={handleRecentInvoices}
              >
                HĐ gần đây
              </Button>
            </div>
            <Card title style={{ marginBottom: 16, height: "250px" }}>
              <div className="info-item" style={{ marginBottom: 20 }}>
                <strong>Tổng mặt hàng:</strong> {selectedProducts.length}
              </div>
              <div className="info-item" style={{ marginBottom: 20 }}>
                <strong>Nợ cũ:</strong>{" "}
                <span style={{ color: "red" }}>{customerOldDebt}</span>
              </div>
              <div className="info-item">
                <strong>Tổng tiền:</strong>{" "}
                <span style={{ color: "red" }}>{totalPrice}</span>
              </div>
            </Card>

            {/* Thông tin nhà cung cấp Card */}
            <Card
              title={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showModal}
                ></Button>
              }
              style={{ marginBottom: 16, height: "250px" }}
            >
              {selectedCustomer ? (
                <div>
                  <div className="info-item" style={{ marginBottom: 20 }}>
                    <strong>Khách hàng:</strong> {selectedCustomer.customerName}
                  </div>
                  <div className="info-item" style={{ marginBottom: 20 }}>
                    <strong>Điện thoại:</strong> {selectedCustomer.phoneNumber}
                  </div>
                  <div className="info-item">
                    <strong>Địa chỉ:</strong> {selectedCustomer.address}
                  </div>
                  {/* Other supplier details */}
                </div>
              ) : (
                <div style={{ fontSize: "16px" }}>Chọn khách hàng</div>
              )}
            </Card>

            <Button
              style={{
                fontSize: "18px", // Tăng kích thước font
                padding: "10px 0", // Tăng padding để nút cao hơn
                height: "auto", // Cho phép chiều cao tự điều chỉnh theo nội dung và padding
              }}
              block
              type="primary"
              onClick={showPayModal}
            >
              Thanh toán
            </Button>
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
        onPaymentAndExportPdf={handlePaymentAndExportPDF}
      />
    </div>
  );
};
export default SaleView;
