import React, { useEffect, useState } from "react";
import CustomerAPI from "../../api/CustomerAPI";
import { Table, Spin, Alert, Layout } from "antd";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import AppSidebar from "../../components/layout/Sidebar";
const { Content } = Layout;

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CustomerAPI.GetAll();
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const columns = [
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
    {
      title: "Địa chị",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "0px 20px", marginTop: 20 }}>
          <div>
            <h1>Customers</h1>
            <Table dataSource={customers} columns={columns} />
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default Customer;
