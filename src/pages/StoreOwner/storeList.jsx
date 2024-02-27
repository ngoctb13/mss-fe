import React, { useState } from "react";
import { Layout, Pagination, Card, Button } from "antd";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import StoreFormModal from "./StoreFormModal";
import { EditOutlined } from "@ant-design/icons";
const { Content } = Layout;

const StoreList = () => {
  const [stores, setStores] = useState([
    {
      id: 1,
      storeName: "Store A",
      address: "123 Main St",
      phoneNumber: "555-1234",
    },
    {
      id: 2,
      storeName: "Store B",
      address: "456 Elm St",
      phoneNumber: "555-5678",
    },
    // Add more stores as needed
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Change as needed
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleModalOpen = (store) => {
    setEditingStore(store);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingStore(null);
    setModalVisible(false);
  };

  const handleCreateOrUpdateStore = (values) => {
    if (editingStore) {
      // Update existing store
      setStores(
        stores.map((store) =>
          store.id === editingStore.id ? { ...store, ...values } : store
        )
      );
    } else {
      // Add new store
      const newStore = {
        id: stores.length + 1,
        ...values,
      };
      setStores([...stores, newStore]);
    }
    handleModalClose();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <Button type="primary" onClick={() => handleModalOpen(null)}>
            Add New Store
          </Button>
          <div>
            {stores.map((store) => (
              <Card key={store.id} style={{ marginBottom: 16 }}>
                <Button
                  icon={<EditOutlined />}
                  style={{ float: "right" }}
                  onClick={() => handleModalOpen(store)}
                />

                <h2>{store.storeName}</h2>
                <p>{store.address}</p>
                <p>{store.phoneNumber}</p>
              </Card>
            ))}
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={stores.length}
            onChange={handlePageChange}
          />
          <StoreFormModal
            visible={modalVisible}
            onCreate={handleCreateOrUpdateStore}
            onCancel={handleModalClose}
            store={editingStore}
          />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default StoreList;
