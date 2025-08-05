import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom';
import React, { useState } from 'react'
import { useEffect } from 'react'
import './Users.css'

function Users() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:3001/api/usercurd/getusers')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
            axios.delete(`http://localhost:3001/api/usercurd/delete/${id}`)
                .then(res => {
                    navigate(0);
                })
                .catch(err => console.log(err));
        }
    };

    const filteredData = data.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <div className="users-title-section">
                    <h1 className="users-title">
                        <i className="fas fa-users"></i>
                        Users Management
                    </h1>
                    <p className="users-subtitle">Manage your system users and their permissions</p>
                </div>
                <Link to={'/users/add'} className="add-user-btn">
                    <i className="fas fa-plus"></i>
                    Add New User
                </Link>
            </div>

            <div className="users-search-section">
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search users by name, email or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="users-stats">
                    <span className="stat-item">
                        <i className="fas fa-users"></i>
                        {filteredData.length} Users
                    </span>
                </div>
            </div>

            <div className="users-table-container">
                {filteredData.length === 0 ? (
                    <div className="no-users">
                        <i className="fas fa-user-slash"></i>
                        <h3>No users found</h3>
                        <p>{searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}</p>
                        {!searchTerm && (
                            <Link to={'/users/add'} className="add-first-user-btn">
                                <i className="fas fa-plus"></i>
                                Add First User
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((user, index) => (
                                    <tr key={index} className="user-row">
                                        <td className="user-id">#{user.id}</td>
                                        <td className="user-name">
                                            <div className="user-avatar">
                                                <i className="fas fa-user"></i>
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="user-email">
                                            <i className="fas fa-envelope"></i>
                                            {user.email}
                                        </td>
                                        <td className="user-role">
                                            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                                                <i className="fas fa-user-tag"></i>
                                                {user.role || 'salesman'}
                                            </span>
                                        </td>
                                        <td className="user-actions">
                                            <Link 
                                                to={`/users/read/${user.id}`} 
                                                className="action-btn read-btn"
                                                title="View Details"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </Link>
                                            <Link 
                                                to={`/users/update/${user.id}`} 
                                                className="action-btn edit-btn"
                                                title="Edit User"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(user.id, user.name)} 
                                                className="action-btn delete-btn"
                                                title="Delete User"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users
