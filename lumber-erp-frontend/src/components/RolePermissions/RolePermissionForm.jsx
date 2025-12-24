import React, { useState, useEffect } from 'react';
import { X, Save, Shield, UserCog } from 'lucide-react';
import { rolePermissionsAPI, rolesAPI, permissionsAPI } from '../../services/api';
import './RolePermissions.css';

const RolePermissionForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    role_id: '',
    selectedPermissions: [],
  });
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item && item.role_id) {
      setFormData(prev => ({ ...prev, role_id: item.role_id }));
    }
  }, [item]);

  useEffect(() => {
    if (formData.role_id) {
      fetchRolePermissions(formData.role_id);
    }
  }, [formData.role_id]);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        rolesAPI.getAll(),
        permissionsAPI.getAll(),
      ]);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await rolePermissionsAPI.getByRole(roleId);
      const permissionIds = (response.data || []).map(rp => rp.permission_id || rp.permissionid);
      setExistingPermissions(permissionIds);
      setFormData(prev => ({ ...prev, selectedPermissions: permissionIds }));
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      setExistingPermissions([]);
      setFormData(prev => ({ ...prev, selectedPermissions: [] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role_id) newErrors.role_id = 'Role is required';
    if (formData.selectedPermissions.length === 0) {
      newErrors.selectedPermissions = 'At least one permission is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setFormData({ role_id: roleId, selectedPermissions: [] });
    if (errors.role_id) {
      setErrors(prev => ({ ...prev, role_id: '' }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const selected = prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter(id => id !== permissionId)
        : [...prev.selectedPermissions, permissionId];
      
      return { ...prev, selectedPermissions: selected };
    });
    
    if (errors.selectedPermissions) {
      setErrors(prev => ({ ...prev, selectedPermissions: '' }));
    }
  };

  const handleSelectAll = () => {
    const allPermissionIds = permissions.map(p => p.permission_id);
    setFormData(prev => ({ ...prev, selectedPermissions: allPermissionIds }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, selectedPermissions: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Use the assign endpoint to handle bulk assignment
      await rolePermissionsAPI.assignPermissions(
        parseInt(formData.role_id),
        formData.selectedPermissions.map(id => parseInt(id))
      );
      
      onSuccess();
    } catch (error) {
      console.error('Error saving role permissions:', error);
      alert('Error saving role permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get permission display name
  const getPermissionDisplayName = (permission) => {
    return `${permission.module_name} - ${permission.action_type}`;
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module_name;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  const selectedRole = roles.find(r => r.role_id === parseInt(formData.role_id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Shield size={24} />
            <h2>Assign Permissions to Role</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="role_id">Select Role *</label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleRoleChange}
                className={errors.role_id ? 'error' : ''}
              >
                <option value="">Choose a role</option>
                {roles.map(role => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              {errors.role_id && <span className="error-text">{errors.role_id}</span>}
            </div>

            {selectedRole && (
              <div className="role-info">
                <UserCog size={18} />
                <span>Managing permissions for: <strong>{selectedRole.role_name}</strong></span>
              </div>
            )}

            {formData.role_id && (
              <>
                <div className="permissions-header">
                  <h3 className="permissions-title">
                    Select Permissions ({formData.selectedPermissions.length} selected)
                  </h3>
                  <div className="permissions-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleSelectAll}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleDeselectAll}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {errors.selectedPermissions && (
                  <span className="error-text">{errors.selectedPermissions}</span>
                )}

                <div className="permissions-modules">
                  {Object.keys(groupedPermissions).map(moduleName => (
                    <div key={moduleName} className="permission-module-group">
                      <h4 className="module-title">{moduleName}</h4>
                      <div className="permissions-grid">
                        {groupedPermissions[moduleName].map(permission => {
                          const isSelected = formData.selectedPermissions.includes(permission.permission_id);
                          const wasExisting = existingPermissions.includes(permission.permission_id);
                          
                          return (
                            <div
                              key={permission.permission_id}
                              className={`permission-card ${isSelected ? 'selected' : ''} ${wasExisting ? 'existing' : ''}`}
                              onClick={() => handlePermissionToggle(permission.permission_id)}
                            >
                              <div className="permission-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="permission-content">
                                <h4 className="permission-name">{permission.action_type}</h4>
                                <p className="permission-description">
                                  Action on {permission.module_name}
                                </p>
                              </div>
                              {wasExisting && !isSelected && (
                                <span className="permission-badge removed">Will be removed</span>
                              )}
                              {!wasExisting && isSelected && (
                                <span className="permission-badge new">New</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.role_id}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionForm;