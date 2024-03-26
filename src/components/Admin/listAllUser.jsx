import React, { useState, useEffect } from 'react';
import UserAPI from './UserAPI'; // Adjust the path according to your project structure

const ListAllUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await UserAPI.getAllUsers(); // Ensure this API method is implemented and exported in UserAPI
                setUsers(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>All Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        {/* Add more columns as needed */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            {/* Add more data fields as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAllUser;
