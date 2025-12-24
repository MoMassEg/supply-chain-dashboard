import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Search, UserCog } from 'lucide-react';
import { rolePermissionsAPI, rolesAPI, permissionsAPI } from '../../services/api';
import RolePermissionForm from './RolePermissionForm';
import './RolePermissions.css';

const RolePermissionList = () => {
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rpRes, rolesRes, permissionsRes] = await Promise.all([
        rolePermissionsAPI.getAll(),
        rolesAPI.getAll(),
        permissionsAPI.getAll(),
      ]);

      setRolePermissions(rpRes.data || []);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId, permissionId) => {
    if (window.confirm('Are you sure you want to remove this permission from the role?')) {
      try {
        await rolePermissionsAPI.delete(roleId, permissionId);
        fetchData();
      } catch (error) {
        console.error('Error deleting role permission:', error);
        alert('Error deleting role permission. Please try again.');
      }
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedRole(null);
    fetchData();
  };

  // Helper function to get permission display name
  const getPermissionDisplayName = (permission) => {
    return `${permission.module_name} - ${permission.action_type}`;
  };

  // Group permissions by role
  const groupedByRole = roles.map(role => {
    const rolePerms = rolePermissions.filter(rp => 
      (rp.role_id || rp.roleid) === role.role_id
    );
    
    const permissionsList = rolePerms.map(rp => {
      const permId = rp.permission_id || rp.permissionid;
      return permissions.find(p => p.permission_id === permId);
    }).filter(Boolean);

    return {
      ...role,
      permissions: permissionsList,
      permissionCount: permissionsList.length
    };
  });

  // Filter by search term
  const filteredRoles = groupedByRole.filter(role =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.permissions.some(p => 
      p.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.action_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Role Permissions</h1>
          <p className="page-subtitle">Manage permissions assigned to roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Assign Permissions
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by role, module or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="role-permissions-list">
          {filteredRoles.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} />
              <h3>No role permissions found</h3>
              <p>Start by assigning permissions to roles</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={20} />
                Assign Permissions
              </button>
            </div>
          ) : (
            filteredRoles.map(role => (
              <div key={role.role_id} className="role-permission-card">
                <div className="role-permission-header">
                  <div className="role-info">
                    <UserCog size={24} />
                    <div>
                      <h3 className="role-name">{role.role_name}</h3>
                      <p className="permission-count">
                        {role.permissionCount} permission{role.permissionCount !== 1 ? 's' : ''} assigned
                      </p>
                    </div>
                  </div>
                  <div className="role-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setSelectedRole(role);
                        setShowForm(true);
                      }}
                      title="Edit permissions"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>

                {role.permissions.length > 0 && (
                  <div className="permissions-list">
                    {role.permissions.map(permission => (
                      <div key={permission.permission_id} className="permission-item">
                        <div className="permission-info">
                          <Shield size={16} />
                          <div>
                            <span className="permission-name">
                              {getPermissionDisplayName(permission)}
                            </span>
                            <span className="permission-desc">
                              Module: {permission.module_name} | Action: {permission.action_type}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn btn-icon btn-danger-ghost"
                          onClick={() => handleDelete(role.role_id, permission.permission_id)}
                          title="Remove permission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {role.permissions.length === 0 && (
                  <div className="no-permissions">
                    <p>No permissions assigned to this role</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <RolePermissionForm
          item={selectedRole}
          onClose={() => {
            setShowForm(false);
            setSelectedRole(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default RolePermissionList;