import React, { useEffect, useState } from "react";
import { Modal, Input, Table, Button } from "antd";
import CustomerAPI from "../../api/CustomerAPI";

const { Search } = Input;
const SelectCustomerModal = ({ isVisible, onCancel, onCustomerSelect }) => {
  // sample data customer
  const [customerList, setCustomerList] = useState([]);
  const [formData, setFormData] = useState({
    search: "",
    phoneNumber: "",
    address: "",
    note: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //
  //
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomerAPI.GetAllByStore();
        setCustomerList(response.data);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };

    fetchCustomers();
  }, []);

  //
  useEffect(() => {
    let filtered;
    if (searchTerm.trim() === "") {
      filtered = customerList;
      setSelectedCustomer({});
    } else {
      filtered = customerList.filter(
        (customer) =>
          customer.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber.includes(searchTerm)
      );
    }

    setFilteredCustomerList(filtered);
  }, [searchTerm, customerList]);

  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
    setSelectedCustomer(null);
  };

  // Columns for customer table
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  const handleRowSelection = (record) => {
    setSelectedCustomer(record);
    setFormData({
      search: record.name || "",
      phoneNumber: record.phoneNumber || "",
      address: record.address || "",
      note: record.note || "",
    });
    setSearchTerm(record.customerName);
  };

  // Function to handle double click on a row
  const handleDoubleClick = () => {
    if (selectedCustomer) {
      onCustomerSelect(selectedCustomer);
      resetFields();
      onCancel();
    }
  };
  //
  const handleModalClose = () => {
    // Reset selected product and all related states
    resetFields();
    // Call the onCancel prop to close the modal
    onCancel();
  };
  //
  const resetFields = () => {
    setFormData({
      search: "",
      phoneNumber: "",
      address: "",
      note: "",
    });
    setSelectedCustomer({});
    setSearchTerm("");
  };
  return (
    <Modal
      title="Chọn khách hàng"
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
              value={selectedCustomer.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>Địa chỉ:</div>
            <Input.TextArea
              rows={3}
              placeholder="Địa chỉ"
              value={selectedCustomer.address}
              name="address"
              onChange={handleChange}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>Ghi chú</div>
            <Input.TextArea
              rows={4}
              placeholder="Ghi chú: "
              value={selectedCustomer.note}
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
              Thêm khách hàng
            </Button>
          </div>
        </div>
        <div style={{ flex: "70%" }}>
          <Table
            dataSource={filteredCustomerList}
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

export default SelectCustomerModal;
