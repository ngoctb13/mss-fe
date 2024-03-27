    import React, { useEffect, useState } from 'react';
    import {Table, message, Space, Switch, Modal, Select, Form, Button} from 'antd';
    import StorageLocationAPI from "../../api/StorageLocationAPI";
    import ProductAPI from "../../api/ProductAPI";

    const { Option } = Select;

    const StorageLocationsScreen = () => {
        const [products, setProducts] = useState([]);
        const [storageLocation, setStorageLocations] = useState([]);
        const [isEditModalVisible, setIsEditModalVisible] = useState(false);
        const [currentProduct, setCurrentProduct] = useState({});
        const [selectedLocations, setSelectedLocations] = useState([]);
        const [allLocations, setAllLocations] = useState([]);
        const userRole = localStorage.getItem("userRole");
        const [isAddModalVisible, setIsAddModalVisible] = useState(false);
        const [form] = Form.useForm();
        const [selectedLocation, setSelectedLocation] = useState(null);
        const [alreadyAssignedLocationIds, setAlreadyAssignedLocationIds] = useState([]);

        useEffect(() => {
            fetchProducts();
            fetchStorageLocations();
            const assignedIds = products.map(product => product.locationId);
            setAlreadyAssignedLocationIds(assignedIds);
        }, []);

        const fetchProducts = async () => {
            try {
                const response = await StorageLocationAPI.GetProductLocation();
                if (response && response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    message.error('Không thể tải được sản phẩm. Định dạng dữ liệu đang không đúng.');
                }
            } catch (error) {
                message.error('Không thể tải được sản phẩm.');
            }
        };

        const fetchStorageLocations = async () => {
            try {
                const response = await StorageLocationAPI.GetByStore();
                if (response && response.data) {
                    setStorageLocations(response.data.filter(loc => loc.id != null));
                } else {
                    message.error('Không thể tải được vị trí sản phẩm.');
                }
            } catch (error) {
                message.error('Không thể tải được vị trí sản phẩm.');
            }
        };

        // Adjust this function to show modal for adding new product-location association
        const showAddModal = () => {
            setIsAddModalVisible(true);
        };

        const handleAddSubmit = async (values) => {
            try {
                await ProductAPI.AddLocationForProduct(values.productId, values.locationId);
                message.success('Vị trí đã được thêm vào cho sản phẩm.');
                form.resetFields(); // Reset form fields after submission
                setIsAddModalVisible(false);
                fetchProducts(); // Refresh the products and locations to reflect the new association
            } catch (error) {
                message.error('Có lỗi khi thêm vị trí vào cho sản phẩm.');
            }
        };

        const showEditModal = (product) => {
            setCurrentProduct(product);
            setSelectedLocation(product.locations[0]?.locationId); // Assuming each product can only have one location
            setIsEditModalVisible(true);
        };

        const handleEditSubmit = async () => {
            try {
                if (!selectedLocation) {
                    message.error('Hãy lựa chọn ít nhất một vị trí.');
                    return;
                }
                await ProductAPI.AddOrUpdateLocationForProduct(currentProduct.productId, selectedLocation);
                message.success('Vị trí của sản phẩm đã được cập nhật.');
                setIsEditModalVisible(false);
                fetchProducts();
            } catch (error) {
                console.error('Lỗi cập nhật vị trí của sản phẩm:', error);
                message.error('Lỗi khi cập nhật vị trí của sản phẩm.');
            }
        };
        const handleCancel = () => {
            setSelectedLocations([]); // Clear the selected locations
            setIsEditModalVisible(false);
        };
        const changeLocationStatus = async (productId) => {
            try {
                await ProductAPI.SetStatus(productId);
                fetchProducts();
                message.success(`Trạng thái của sản phẩm đã được cập nhật.`);
            } catch (error) {
                message.error('Lỗi trong quá trình cập nhật sản phẩm.');
            }
        };

        const columns = [
            {
                title: 'Id',
                dataIndex: 'productId',
                key: 'productId',
                className: 'hidden-column'
            },
            {
                title: 'Id',
                dataIndex: 'locationId',
                key: 'locationId',
                className: 'hidden-column'
            },
            {
                title: 'STT',
                key: 'index',
                render: (_, __, index) => index + 1,
            },
            {
                title: 'Tên sản phẩm',
                dataIndex: 'productName',
                key: 'productName',
            },

            {
                title: 'Giá bán lẻ',
                dataIndex: 'retailPrice',
                key: 'retailPrice',
                render: (text) => `${text} VND`,
            },
            {
                title: 'Còn tồn',
                dataIndex: 'inventory',
                key: 'inventory',
            },
            {
                title: 'Loại bao',
                dataIndex: 'bag_packing',
                key: 'bag_packing',
            },
            {
                title: 'Tên phân khu',
                dataIndex: 'locations',
                key: 'locationNames',
                render: locations => {

                    const locationNames = locations.map(location => location.locationName);
                    const uniqueLocationNames = [...new Set(locationNames)];
                    return uniqueLocationNames.join(', ');
                },
            },
            {
                title: 'Chức năng',
                key: 'action',
                render: (_, record) => (
                    <Space size="middle">
                        {userRole === 'STORE_OWNER' && (
                            <>
                                <a onClick={() => showEditModal(record)}>Chỉnh sửa</a>
                                <Switch checked={record.status === 'ACTIVE'}
                                        onChange={(checked) => changeLocationStatus(record.productId, checked)}/>
                            </>
                        )}
                    </Space>
                ),
            },
        ];

        return (
            <>
                <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
                    Thêm mới
                </Button>
                <Table columns={columns} dataSource={products} rowKey="productId" />
                <Modal
                    title="Chỉnh sửa vị trí của sản phẩm"
                    visible={isEditModalVisible}
                    onOk={handleEditSubmit}
                    onCancel={handleCancel}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn vị trí"
                        value={selectedLocation} // Assuming this is now a single value, not an array
                        onChange={(value) => setSelectedLocation(value)} // Update the selected location on change
                        optionLabelProp="label"
                    >
                        {storageLocation.map((location) => (
                            <Option key={location.id} value={location.id}>{location.locationName}</Option>
                        ))}
                    </Select>
                </Modal>



                <Modal
                    title="Thêm mới sản phẩm vào vị trí"
                    visible={isAddModalVisible}
                    onCancel={() => setIsAddModalVisible(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
                        <Form.Item
                            name="productId"
                            label="Sản phẩm"
                            rules={[{ required: true, message: 'Hãy chọn sản phẩm !' }]}
                        >
                            <Select placeholder="Lựa chọn sản phẩm">
                                {products.map(product => (
                                    <Option key={product.productId} value={product.productId}>{product.productName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="locationId" // Changed to singular as we're now allowing selection of one location
                            label="Phân khu"
                            rules={[{ required: true, message: 'Hãy chọn một phân khu !' }]}
                        >
                            <Select
                                placeholder="Lựa chọn một phân khu"
                            >
                                {storageLocation.map((location) => (
                                    <Option key={location.id} value={location.id} label={location.locationName}>
                                        {location.locationName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Thêm vị trí vào sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

            </>
        );
    };
    export default StorageLocationsScreen;
