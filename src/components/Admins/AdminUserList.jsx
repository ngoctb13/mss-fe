import React, { useEffect, useState } from "react";
import {Table, Switch, Popconfirm, message, Space, Layout} from "antd";
import AdminAPI from "../../api/AdminAPI"; // Đảm bảo bạn đã import AdminAPI
import { Link } from "react-router-dom"; // Đảm bảo bạn đã import Link
import AdHeader from '../layout/AdminLayout/Header';
const { Header, Footer, Content } = Layout;

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await AdminAPI.GetAll();
            setUsers(response.data);
        } catch (error) {
            message.error("Could not fetch users");
        }
    };

    const ConfirmSwitch = ({ userId, initialChecked }) => {
        const [checked, setChecked] = useState(initialChecked);
        const [visible, setVisible] = useState(false);

        // Khi người dùng bật/tắt switch, hiện hộp thoại xác nhận
        const handleChange = () => {
            setVisible(true); // Hiện Popconfirm
        };

        // Xử lý khi người dùng xác nhận thay đổi
        const handleConfirm = async () => {
            setVisible(false); // Ẩn Popconfirm
            try {
                await AdminAPI.DeactivateUser(userId); // Sử dụng API để toggle trạng thái
                setChecked(!checked); // Thay đổi trạng thái của switch sau khi API thành công
                message.success(`User ${checked ? "deactivated" : "activated"} successfully`);
                fetchUsers(); // Cập nhật danh sách người dùng
            } catch (error) {
                message.error(`Failed to ${checked ? "deactivate" : "activate"} user`);
            }
        };

        // Xử lý khi người dùng hủy bỏ thay đổi
        const handleCancel = () => {
            setVisible(false); // Ẩn Popconfirm
        };

        return (
            <Popconfirm
                title={`Are you sure to ${checked ? "deactivate" : "activate"} this user?`}
                visible={visible}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <Switch checked={checked} onChange={handleChange} />
            </Popconfirm>
        );
    };

    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (status === "ACTIVE" ? "Active" : "Inactive"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <ConfirmSwitch
                    userId={record.id}
                    initialChecked={record.status === "ACTIVE"}
                />
            ),
        },
    ];

    return (
        <Layout className="layout">
            <AdHeader />
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content" style={{ margin: '100px auto', maxWidth: '960px' }}>
                    <Table className="table" dataSource={users} columns={columns} rowKey="id" />
                </div>
            </Content>
        </Layout>
    );
};

export default UserManagement;
