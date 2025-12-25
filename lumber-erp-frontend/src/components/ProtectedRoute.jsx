import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  // Fetch user permissions from APIs
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user || !user.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [ProtectedRoute] Fetching permissions for user:', user.user_id);

        const rolesResponse = await axios.get(`${API_URL}/roles`);
        const userRole = rolesResponse.data.find(role => role.user_id === user.user_id);
        
        if (!userRole) {
          console.warn('⚠️ [ProtectedRoute] No role found for user');
          setUserPermissions([]);
          setLoading(false);
          return;
        }

        console.log('✅ [ProtectedRoute] User role:', userRole);

        const rolePermsResponse = await axios.get(`${API_URL}/rolepermissions`);
        const userRolePerms = rolePermsResponse.data.filter(
          rp => rp.role_id === userRole.role_id
        );

        const permissionsResponse = await axios.get(`${API_URL}/permissions`);
        const allPermissions = permissionsResponse.data;

        const userPermissionDetails = userRolePerms.map(rp => {
          const permDetail = allPermissions.find(p => p.permission_id === rp.permission_id);
          return permDetail;
        }).filter(Boolean);

        console.log('✅ [ProtectedRoute] User permissions:', userPermissionDetails);
        setUserPermissions(userPermissionDetails);

      } catch (error) {
        console.error('❌ [ProtectedRoute] Error fetching permissions:', error);
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);

  // Map routes to their module groups
  const routeToModuleMap = {
    // Dashboard & Profile - Always accessible
    '/': null,
    '/profile': null,
    
    // User Management Group
    '/users': 'User Management',
    '/permissions': 'User Management',
    '/roles': 'User Management',
    '/role-permissions': 'User Management',
    
    // HR & Employees Group
    '/employees': 'HR & Employees',
    '/worker-assignments': 'HR & Employees',
    '/management-insights': 'HR & Employees',
    
    // Suppliers Group
    '/suppliers': 'Suppliers',
    '/supplier-performance': 'Suppliers',
    '/supplier-contracts': 'Suppliers',
    
    // Forest & Harvesting Group
    '/forests': 'Forest & Harvesting',
    '/tree-species': 'Forest & Harvesting',
    '/harvest-schedules': 'Forest & Harvesting',
    '/harvest-batches': 'Forest & Harvesting',
    
    // Processing & Sawmill Group
    '/sawmills': 'Processing & Sawmill',
    '/processing-units': 'Processing & Sawmill',
    '/processing-orders': 'Processing & Sawmill',
    '/maintenance-records': 'Processing & Sawmill',
    '/waste-records': 'Processing & Sawmill',
    
    // Quality Control Group
    '/quality-inspections': 'Quality Control',
    
    // Warehouse & Inventory Group
    '/warehouses': 'Warehouse & Inventory',
    '/product-types': 'Warehouse & Inventory',
    '/stock-items': 'Warehouse & Inventory',
    '/stock-alerts': 'Warehouse & Inventory',
    '/inventory-transactions': 'Warehouse & Inventory',
    
    // Procurement Group
    '/purchase-orders': 'Procurement',
    '/purchase-order-items': 'Procurement',
    
    // Sales & Customers Group
    '/customers': 'Sales & Customers',
    '/sales-orders': 'Sales & Customers',
    '/sales-order-items': 'Sales & Customers',
    
    // Financial Group
    '/invoices': 'Invoicing & Payments',
    '/payments': 'Invoicing & Payments',
    
    // Transportation Group
    '/transport-companies': 'Transportation',
    '/trucks': 'Transportation',
    '/drivers': 'Transportation',
    '/routes': 'Transportation',
    '/shipments': 'Transportation',
    '/fuel-logs': 'Transportation',
  };

  // Check if user has ANY permission for a module (READ, CREATE, UPDATE, or DELETE)
  const hasModuleAccess = (moduleName) => {
    if (!moduleName) return true; // Dashboard/Profile
    if (!userPermissions || userPermissions.length === 0) return false;

    // Check if user has ANY action type for this module
    const hasAccess = userPermissions.some(
      perm => perm.module_name === moduleName
    );

    console.log(`🔍 [ProtectedRoute] Module "${moduleName}" access: ${hasAccess ? '✅ GRANTED' : '❌ DENIED'}`);
    
    if (hasAccess) {
      const userActions = userPermissions
        .filter(p => p.module_name === moduleName)
        .map(p => p.action_type);
      console.log(`   Actions available: ${userActions.join(', ')}`);
    }

    return hasAccess;
  };

  // Check if user can access a specific path
  const hasPathAccess = (path) => {
    const moduleName = routeToModuleMap[path];
    
    if (moduleName === undefined) {
      console.log(`⚠️ [ProtectedRoute] No module mapping for path: ${path}`);
      return false;
    }

    return hasModuleAccess(moduleName);
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
        <style>{spinnerKeyframes}</style>
      </div>
    );
  }

  // ==================== NOT AUTHENTICATED ====================
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ==================== CHECK FOR NO ROLE ====================
  const currentPath = location.pathname;
  const isPublicPath = currentPath === '/' || currentPath === '/profile';
  
  if (userPermissions.length === 0 && !isPublicPath) {
    return <NoRoleAssigned user={user} path={currentPath} logout={logout} navigate={navigate} />;
  }

  // ==================== CHECK PATH PERMISSIONS ====================
  const hasAccess = hasPathAccess(currentPath);

  if (!hasAccess && !isPublicPath) {
    const requiredModule = routeToModuleMap[currentPath];
    return <AccessDenied 
      path={currentPath} 
      user={user} 
      permissions={userPermissions}
      requiredModule={requiredModule}
      logout={logout}
      navigate={navigate}
    />;
  }

  // ==================== AUTHORIZED - RENDER CHILDREN ====================
  return children;
};

// ==================== NO ROLE ASSIGNED COMPONENT ====================
const NoRoleAssigned = ({ user, path, logout, navigate }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefreshSession = () => {
    setRefreshing(true);
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    logout();
    setTimeout(() => {
      navigate('/login', { state: { message: 'Please login again to refresh your session' } });
    }, 500);
  };

  return (
    <div style={styles.deniedContainer}>
      <div style={styles.deniedCard}>
        <div style={styles.warningIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 style={styles.deniedTitle}>No Role Assigned</h1>
        <p style={styles.deniedMessage}>
          Your account doesn't have a role assigned yet.
        </p>

        <div style={styles.deniedDetails}>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>User:</strong>
            <span>{user.first_name} {user.last_name}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>User ID:</strong>
            <span>{user.user_id}</span>
          </div>
        </div>

        <div style={styles.refreshBox}>
          <div style={styles.refreshIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </div>
          <div style={styles.refreshContent}>
            <h3 style={styles.refreshTitle}>Just Assigned a Role?</h3>
            <p style={styles.refreshText}>
              If an administrator just assigned you a role, click the button below to refresh your session.
            </p>
            <button
              style={styles.refreshButton}
              onClick={handleRefreshSession}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <div style={styles.miniSpinner}></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh Session
                </>
              )}
            </button>
          </div>
        </div>

        <div style={styles.deniedActions}>
          <button 
            style={{...styles.button, ...styles.buttonBack}}
            onClick={() => window.history.back()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Go Back
          </button>
          <button 
            style={{...styles.button, ...styles.buttonHome}}
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </button>
        </div>

        <div style={styles.deniedFooter}>
          <p style={styles.footerText}>
            <strong>Limited Access:</strong> You can only access the Dashboard and your Profile until a role is assigned.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== ACCESS DENIED COMPONENT ====================
const AccessDenied = ({ path, user, permissions, requiredModule, logout, navigate }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefreshSession = () => {
    setRefreshing(true);
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    logout();
    setTimeout(() => {
      navigate('/login', { state: { message: 'Please login again to refresh your permissions' } });
    }, 500);
  };

  return (
    <div style={styles.deniedContainer}>
      <div style={styles.deniedCard}>
        <div style={styles.deniedIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <h1 style={styles.deniedTitle}>Access Denied</h1>
        <p style={styles.deniedMessage}>
          You don't have permission to access this page.
        </p>

        <div style={styles.deniedDetails}>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>User:</strong>
            <span>{user.first_name} {user.last_name}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>Role:</strong>
            <span>{user.role_name || 'No Role Assigned'}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>Path:</strong>
            <span>{path}</span>
          </div>
          {requiredModule && (
            <div style={styles.detailItem}>
              <strong style={styles.detailLabel}>Required Module:</strong>
              <span>{requiredModule} (any action: READ, CREATE, UPDATE, or DELETE)</span>
            </div>
          )}
          <div style={styles.detailItem}>
            <strong style={styles.detailLabel}>Your Permissions:</strong>
            <span>{permissions.length}</span>
          </div>
        </div>

        <div style={styles.refreshBox}>
          <div style={styles.refreshIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </div>
          <div style={styles.refreshContent}>
            <h3 style={styles.refreshTitle}>Just Got New Permissions?</h3>
            <p style={styles.refreshText}>
              If an administrator just granted you access, refresh your session to load the new permissions.
            </p>
            <button
              style={styles.refreshButton}
              onClick={handleRefreshSession}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <div style={styles.miniSpinner}></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh Session
                </>
              )}
            </button>
          </div>
        </div>

        {permissions.length > 0 && (
          <details style={styles.permissionsList}>
            <summary style={styles.permissionsSummary}>
              View Your Current Permissions ({permissions.length})
            </summary>
            <div style={styles.permissionsContent}>
              {permissions.map((perm, idx) => (
                <div key={idx} style={styles.permissionItem}>
                  <span style={styles.permissionModule}>{perm.module_name}</span>
                  <span style={styles.permissionAction}>{perm.action_type}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        <div style={styles.deniedActions}>
          <button 
            style={{...styles.button, ...styles.buttonBack}}
            onClick={() => window.history.back()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Go Back
          </button>
          <button 
            style={{...styles.button, ...styles.buttonHome}}
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </button>
        </div>

        <div style={styles.deniedFooter}>
          <p style={styles.footerText}>
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== STYLES ====================
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  miniSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  deniedContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
  },
  deniedCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '3rem',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center',
  },
  deniedIcon: {
    display: 'inline-flex',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    borderRadius: '50%',
    color: '#dc2626',
    marginBottom: '1.5rem',
  },
  warningIcon: {
    display: 'inline-flex',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '50%',
    color: '#f59e0b',
    marginBottom: '1.5rem',
  },
  deniedTitle: {
    fontSize: '2rem',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  deniedMessage: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: '0 0 2rem 0',
  },
  deniedDetails: {
    background: '#f9fafb',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  detailItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  detailLabel: {
    color: '#374151',
    fontWeight: '600',
    minWidth: '140px',
    flexShrink: 0,
  },
  refreshBox: {
    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    border: '2px solid #a855f7',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
    textAlign: 'left',
  },
  refreshIcon: {
    color: '#7c3aed',
    flexShrink: 0,
  },
  refreshContent: {
    flex: 1,
  },
  refreshTitle: {
    margin: '0 0 0.5rem 0',
    color: '#5b21b6',
    fontSize: '1.1rem',
  },
  refreshText: {
    margin: '0 0 1rem 0',
    color: '#374151',
    fontSize: '0.9rem',
  },
  refreshButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  permissionsList: {
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  permissionsSummary: {
    cursor: 'pointer',
    padding: '1rem',
    background: '#f3f4f6',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#374151',
    userSelect: 'none',
  },
  permissionsContent: {
    marginTop: '0.5rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  permissionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  permissionModule: {
    fontWeight: '500',
    color: '#374151',
  },
  permissionAction: {
    fontSize: '0.875rem',
    color: '#6b7280',
    background: '#e5e7eb',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
  },
  deniedActions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  button: {
    flex: 1,
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  buttonBack: {
    background: '#f3f4f6',
    color: '#374151',
  },
  buttonHome: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  deniedFooter: {
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    color: '#6b7280',
    fontSize: '0.9rem',
    margin: '0',
  },
};

const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default ProtectedRoute;