import React, { useEffect, useState } from 'react';
import { Table, message, Space, Switch, Modal, Select } from 'antd';
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


    useEffect(() => {
        fetchProducts();
        fetchStorageLocations();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await StorageLocationAPI.GetProductLocation();
            if (response && response.data && Array.isArray(response.data.products)) {
                setProducts(response.data.products);
                const uniqueLocations = [];
                response.data.products.forEach(product => {
                    product.locations.forEach(location => {
                        if (!uniqueLocations.some(loc => loc.id === location.id)) {
                            uniqueLocations.push(location);
                        }
                    });
                });
                setAllLocations(uniqueLocations);
            } else {
                message.error('Could not fetch products. Data format is incorrect.');
            }
        } catch (error) {
            message.error('Could not fetch products.');
        }
    };

    const fetchStorageLocations = async () => {
        try {
            const response = await StorageLocationAPI.GetAll();
            if (response && response.data) {
                // Filter out any invalid location data
                const validLocations = response.data.filter(loc => loc.id != null);
                setStorageLocations(validLocations);
            } else {
                message.error('Could not fetch storage locations.');
            }
        } catch (error) {
            message.error('Failed to fetch storage locations.');
        }
    };

    const showEditModal = (product) => {
        setCurrentProduct(product);
        const locationIds = product.locations
            .filter(loc => loc != null && loc.id != null) // Make sure to filter out null values
            .map(loc => loc.id);
        setSelectedLocations(locationIds);
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            const validLocations = selectedLocations.filter(loc => loc != null);
            if (validLocations.length === 0) {
                message.error('Please select at least one valid location.');
                return;
            }
            await ProductAPI.AddLocationForProduct(currentProduct.productId, validLocations);
            setIsEditModalVisible(false);
            fetchProducts();
            message.success('Product locations updated successfully.');
        } catch (error) {
            console.error('Error updating product locations:', error);
            message.error('Failed to update product locations.');
        }
    };

    const changeLocationStatus = async (productId) => {
        try {
            await ProductAPI.SetStatus(productId);
            fetchProducts();
            message.success(`Product status changed successfully.`);
        } catch (error) {
            message.error('Failed to change product status.');
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
                            <a onClick={() => showEditModal(record)}>Edit</a>
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
            <Table columns={columns} dataSource={products} rowKey="productId" />
            <Modal title="Edit Product Locations" visible={isEditModalVisible} onOk={handleEditSubmit} onCancel={() => setIsEditModalVisible(false)}>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select locations"
                    value={selectedLocations} // This must be an array of selected location IDs
                    onChange={(value) => setSelectedLocations(value)} // Make sure to update the state with the new value
                >
                    {storageLocation.map(location => (
                        <Option key={location.id} value={location.id}>{location.locationName}</Option>
                    ))}
                </Select>
            </Modal>

        </>
    );
};

export default StorageLocationsScreen;
