import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Table } from "antd";
import UserAPI from "../../api/UserAPI";
import moment from "moment";
import ImportInvoiceAPI from "../../api/ImportInvoiceAPI";
import SupplierAPI from "../../api/SupplierAPI";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ImportInvoiceReportList = () => {
    const [filters, setFilters] = useState({
        dateRange: [
            moment().startOf('month'),
            moment().endOf('month')
        ],
        createdBy: "Tất cả", // Set initial value to empty string
        supplierId: "Tất cả", // Set initial value to empty string
    });
    const [saleInvoiceData, setSaleInvoiceData] = useState([]);
    const [usersOfStore, setUsersOfStore] = useState([]);
    const [customersOfStore, setCustomersOfStore] = useState([]);

    useEffect(() => {
        // Tải danh sách nhân viên
        const fetchUsersOfStore = async () => {
            try {
                const response = await UserAPI.GetAllOfStore();
                console.log(response.data)
                setUsersOfStore(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Xử lý lỗi ở đây
            }
        };
        // Tải danh sách khách hàng
        const fetchCustomersOfStore = async () => {
            try {
                const response = await SupplierAPI.GetAll();
                setCustomersOfStore(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
                // Xử lý lỗi ở đây
            }
        };
        fetchUsersOfStore();
        fetchCustomersOfStore();
    }, []);

    const columns = [
        // Định nghĩa các cột theo dữ liệu bạn cần hiển thị
        // Ví dụ:
        {
            title: "",
            key: "stt",
            width: "1%",
            render: (text, record, index) => index + 1,
        },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
        { title: "NV", dataIndex: "createdBy", key: "createdBy" },
        { title: "Tiền hàng", dataIndex: "totalPrice", key: "totalPrice" },
        { title: "Nợ cũ", dataIndex: "oldDebt", key: "oldDebt", render: (text, record) => (record.oldDebt === null ? 0 : record.oldDebt) },
        { title: "Tổng cộng", dataIndex: "totalPayment", key: "totalPayment" },
        { title: "Đã trả", dataIndex: "pricePaid", key: "pricePaid" },
        { title: "Còn nợ", dataIndex: "newDebt", key: "newDebt" },
        {
            title: "Khách hàng",
            dataIndex: "supplierName",
            key: "supplierName",
            render: (text, record) => record.supplier.supplierName,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (text, record) => record.supplier.phoneNumber,
        },
        {
            title: "Địa chỉ",
            dataIndex: "Địa chỉ",
            key: "Địa chỉ",
            render: (text, record) => record.supplier.address,
        },
        // ... thêm các cột khác theo ảnh bạn cung cấp
    ];

    // Hàm xử lý khi giá trị trong filter thay đổi
    const handleFilterChange = (name, value) => {
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // Hàm xử lý khi người dùng nhấn nút 'Lọc'
    const handleFilter = async () => {
        // console.log(filters);
        try {
            const { dateRange, createdBy, supplierId } = filters;
            const filterParams = {
                startDate: dateRange[0]
                    ? dateRange[0].format("YYYY-MM-DDTHH:mm:ss")
                    : null,
                endDate: dateRange[1]
                    ? dateRange[1].format("YYYY-MM-DDTHH:mm:ss")
                    : null,

            };
            if (createdBy !== "Tất cả") {
                filterParams.createdBy = createdBy;
            }

            // If supplierId is not "Tất cả", add it to filterParams
            if (supplierId !== "Tất cả") {
                filterParams.supplierId = supplierId;
            }
            const response = await ImportInvoiceAPI.GetByFilter(filterParams);
            setSaleInvoiceData(response.data);
        } catch (error) {
            console.error("Error fetching filtered sale invoices:", error);
        }
        // Tại đây bạn sẽ thực hiện việc lọc dữ liệu dựa trên các filter
    };

    return (
        <div>
            <div style={{ marginBottom: 10 }}>
                {/* div 1: Filters */}
                <RangePicker
                    format="DD/MM/YYYY HH:mm:ss"
                    showTime
                    onChange={(dates) => handleFilterChange("dateRange", dates)}
                    defaultValue={[
                        moment().startOf('month'),
                        moment().endOf('month')
                    ]}
                />
                <Select
                    placeholder="Chọn nhân viên"
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange("createdBy", value)}
                    defaultValue={"Tất cả"}
                >
                    <Option value={"Tất cả"}>Tất cả</Option>
                    {usersOfStore.map((us) => (
                        <Option key={us.id} value={us.username}>

                            {us.username}
                        </Option> // Giả sử `emp.name` là tên của nhân viên
                    ))}
                </Select>
                <Select
                    placeholder="Chọn khách hàng"
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange("supplierId", value)}
                    defaultValue={"Tất cả"}
                >
                    <Option value={"Tất cả"}>Tất cả</Option>
                    {customersOfStore.map((cus) => (
                        <Option key={cus.id} value={cus.id}>
                            {cus.supplierName}
                        </Option> // Giả sử `cus.name` là tên của khách hàng
                    ))}
                </Select>
                <Button type="primary" onClick={handleFilter}>
                    Lọc
                </Button>
            </div>
            <div>
                {/* div 2: Table */}
                <Table columns={columns} dataSource={saleInvoiceData} size="small"/>
            </div>
        </div>
    );
};

export default ImportInvoiceReportList;
