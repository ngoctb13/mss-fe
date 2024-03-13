import React, { useEffect, useState } from "react";
import { Modal, Input, Table, Button } from "antd";
import SupplierAPI from "../../api/SupplierAPI";

const { Search } = Input;

const SelectSupplierModal = ({ isVisible, onCancel, onSupplierSelect }) => {
  // sample data customer
  const [supplierList, setSupplierList] = useState([]);
  const [formData, setFormData] = useState({
    search: "",
    phoneNumber: "",
    address: "",
    note: "",
  });

  // State to hold selected customer
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filteredSupplierList, setFilteredSupplierList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //
  useEffect(() => {
    SupplierAPI.GetAll()
      .then((response) => {
        // Assuming the response is an array of suppliers
        setSupplierList(response.data);
      })
      .catch((error) => {
        // Handle the error appropriately
        console.error("Error fetching suppliers:", error);
      });
  }, []);

  useEffect(() => {
    let filtered;
    if (searchTerm.trim() === "") {
      filtered = supplierList;
    } else {
      filtered = supplierList.filter((supplier) =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSupplierList(filtered);
  }, [searchTerm, supplierList]);
  //
  const handleSubmit = () => {
    // Call API to add customer with formData
    console.log("Form Data:", formData);
    // Reset form data after submitting
    setFormData({
      search: "",
      phoneNumber: "",
      address: "",
      note: "",
    });
    setSelectedSupplier(null);
  };

  // Columns for customer table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
    },
  ];

  const handleRowSelection = (record) => {
    setSelectedSupplier(record);
    setFormData({
      search: record.supplierName || "",
      phoneNumber: record.phoneNumber || "",
      address: record.address || "",
      note: record.note || "",
    });
    setSearchTerm(record.supplierName);
  };

  // Function to handle double click on a row
  const handleDoubleClick = () => {
    // Send selected customer back to parent component (SaleInvoice.jsx)
    // You can implement this part as per your requirement
    console.log("Selected Customer:", selectedSupplier);
    if (selectedSupplier) {
      onSupplierSelect(selectedSupplier);
      resetFields();
      onCancel(); // Optionally close the modal after selection
    }
  };
  const resetFields = () => {
    setFormData({
      search: "",
      phoneNumber: "",
      address: "",
      note: "",
    });
    setSelectedSupplier(null);
    setSearchTerm("");
  };

  const handleModalClose = () => {
    // Reset selected product and all related states
    resetFields();
    // Call the onCancel prop to close the modal
    onCancel();
  };

  return (
    <Modal
      title="Chọn nhà cung cấp"
      visible={isVisible}
      centered
      onCancel={handleModalClose}
      width={1000}
      height={650}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "30%", marginRight: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>
              Số điện thoại:
            </div>
            <Input
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>Địa chỉ:</div>
            <Input.TextArea
              rows={3}
              placeholder="Địa chỉ"
              value={formData.address}
              name="address"
              onChange={handleChange}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>Ghi chú</div>
            <Input.TextArea
              rows={4}
              placeholder="Ghi chú: "
              value={formData.note}
              name="note"
              onChange={handleChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              marginTop: 115,
            }}
          >
            <Button type="primary" onClick={handleSubmit}>
              Thêm nhà cung cấp
            </Button>
          </div>
        </div>
        <div style={{ flex: "70%" }}>
          <Table
            dataSource={filteredSupplierList}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleRowSelection(record),
              onDoubleClick: () => handleDoubleClick(),
            })}
            scroll={{ y: 400 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SelectSupplierModal;
