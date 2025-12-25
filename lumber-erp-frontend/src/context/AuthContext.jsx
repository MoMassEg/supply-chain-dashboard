import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  // ==================== PERMISSION CHECKING FUNCTIONS ====================
  
  // Check if user has specific permission (module + action)
  const hasPermission = (moduleName, actionType) => {
    if (!permissions || permissions.length === 0) {
      console.log(`No permissions available`);
      return false;
    }
    
    const result = permissions.some(
      perm => perm.module_name === moduleName && perm.action_type === actionType
    );
    
    return result;
  };

  // Check if user has ANY permission for a module
  const hasModuleAccess = (moduleName) => {
    if (!permissions || permissions.length === 0) {
      return false;
    }
    
    return permissions.some(perm => perm.module_name === moduleName);
  };

  // Map paths to required permissions
  const pathPermissionMap = {
    // User Management
    '/users': { module: 'Users', action: 'View' },
    '/permissions': { module: 'Permissions', action: 'View' },
    '/roles': { module: 'Roles', action: 'View' },
    '/role-permissions': { module: 'RolePermissions', action: 'View' },
    
    // HR & Employees
    '/employees': { module: 'Employees', action: 'View' },
    '/worker-assignments': { module: 'WorkerAssignments', action: 'View' },
    '/management-insights': { module: 'ManagementInsights', action: 'View' },
    
    // Suppliers
    '/suppliers': { module: 'Suppliers', action: 'View' },
    '/supplier-performance': { module: 'SupplierPerformance', action: 'View' },
    '/supplier-contracts': { module: 'SupplierContracts', action: 'View' },
    
    // Forest & Harvesting
    '/forests': { module: 'Forests', action: 'View' },
    '/tree-species': { module: 'TreeSpecies', action: 'View' },
    '/harvest-schedules': { module: 'HarvestSchedules', action: 'View' },
    '/harvest-batches': { module: 'HarvestBatches', action: 'View' },
    
    // Processing & Sawmill
    '/sawmills': { module: 'Sawmills', action: 'View' },
    '/processing-units': { module: 'ProcessingUnits', action: 'View' },
    '/processing-orders': { module: 'ProcessingOrders', action: 'View' },
    '/maintenance-records': { module: 'MaintenanceRecords', action: 'View' },
    '/waste-records': { module: 'WasteRecords', action: 'View' },
    
    // Quality Control
    '/quality-inspections': { module: 'QualityInspections', action: 'View' },
    
    // Warehouse & Inventory
    '/warehouses': { module: 'Warehouses', action: 'View' },
    '/product-types': { module: 'ProductTypes', action: 'View' },
    '/stock-items': { module: 'StockItems', action: 'View' },
    '/stock-alerts': { module: 'StockAlerts', action: 'View' },
    '/inventory-transactions': { module: 'InventoryTransactions', action: 'View' },
    
    // Procurement
    '/purchase-orders': { module: 'PurchaseOrders', action: 'View' },
    '/purchase-order-items': { module: 'PurchaseOrderItems', action: 'View' },
    
    // Sales & Customers
    '/customers': { module: 'Customers', action: 'View' },
    '/sales-orders': { module: 'SalesOrders', action: 'View' },
    '/sales-order-items': { module: 'SalesOrderItems', action: 'View' },
    
    // Financial
    '/invoices': { module: 'Invoices', action: 'View' },
    '/payments': { module: 'Payments', action: 'View' },
    
    // Transportation
    '/transport-companies': { module: 'TransportCompanies', action: 'View' },
    '/trucks': { module: 'Trucks', action: 'View' },
    '/drivers': { module: 'Drivers', action: 'View' },
    '/routes': { module: 'Routes', action: 'View' },
    '/shipments': { module: 'Shipments', action: 'View' },
    '/fuel-logs': { module: 'FuelLogs', action: 'View' },
  };

  // Check if user can access a specific path
  const hasPathAccess = (path) => {
    // Dashboard and profile are always accessible
    if (path === '/' || path === '/profile') {
      return true;
    }

    const requiredPerm = pathPermissionMap[path];
    if (!requiredPerm) {
      console.log(`No permission mapping found for path: ${path}`);
      return false;
    }

    return hasPermission(requiredPerm.module, requiredPerm.action);
  };

  // ==================== FETCH PERMISSIONS ====================
  
  const fetchUserPermissions = async (roleId) => {
    try {
      console.log('📋 Fetching permissions for role_id:', roleId);
      const response = await axios.get(`${API_URL}/rolepermissions/role?role_id=${roleId}`);
      console.log('✅ Permissions loaded:', response.data);
      
      const perms = response.data || [];
      setPermissions(perms);
      localStorage.setItem('permissions', JSON.stringify(perms));
      
      return perms;
    } catch (error) {
      console.error('❌ Error fetching permissions:', error);
      setPermissions([]);
      localStorage.removeItem('permissions');
      return [];
    }
  };

  // ==================== FETCH USER ROLE ====================
  
  const fetchUserRole = async (userId) => {
    try {
      console.log('👤 Fetching role for user_id:', userId);
      const response = await axios.get(`${API_URL}/roles`);
      const userRole = response.data.find(role => role.user_id === userId);
      
      if (userRole) {
        console.log('✅ Role found:', userRole);
        return userRole;
      } else {
        console.warn('⚠️ No role assigned to user');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching role:', error);
      return null;
    }
  };

  // ==================== LOGIN FUNCTION ====================
  
  const login = async (userData) => {
    try {
      console.log('🔐 Login process started for user:', userData.email);
      
      // Store basic user data first
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Fetch user's role
      const userRole = await fetchUserRole(userData.user_id);
      
      if (userRole) {
        // Update user data with role info
        const updatedUserData = {
          ...userData,
          role_id: userRole.role_id,
          role_name: userRole.role_name,
          role_description: userRole.description
        };
        
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        // Fetch permissions for this role
        await fetchUserPermissions(userRole.role_id);
        
        console.log('✅ Login completed successfully');
        return { success: true, user: updatedUserData };
      } else {
        // User has no role - limited access
        console.warn('⚠️ User has no role assigned - limited access');
        setPermissions([]);
        localStorage.setItem('permissions', JSON.stringify([]));
        
        return { 
          success: true, 
          user: userData, 
          warning: 'No role assigned - limited access' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // ==================== LOGOUT FUNCTION ====================
  
  const logout = () => {
    console.log('👋 Logging out...');
    setUser(null);
    setPermissions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  };

  // ==================== UPDATE USER FUNCTION ====================
  
  const updateUser = async (userData) => {
    try {
      console.log('🔄 Updating user data...');
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // If role changed, refetch permissions
      if (userData.role_id) {
        await fetchUserPermissions(userData.role_id);
      }

      console.log('✅ User updated successfully');
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  // ==================== REFRESH PERMISSIONS ====================
  
  const refreshPermissions = async () => {
    if (user && user.role_id) {
      console.log('🔄 Refreshing permissions...');
      await fetchUserPermissions(user.role_id);
    }
  };

  // ==================== CHECK AUTH ON MOUNT ====================
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        
        const storedUser = localStorage.getItem('user');
        const storedPermissions = localStorage.getItem('permissions');

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('✅ User found in storage:', userData.email);
          setUser(userData);

          // Load stored permissions first (instant)
          if (storedPermissions) {
            const perms = JSON.parse(storedPermissions);
            console.log('📋 Loaded stored permissions:', perms.length);
            setPermissions(perms);
          }

          // Fetch fresh permissions in background if user has role
          if (userData.role_id) {
            console.log('🔄 Fetching fresh permissions...');
            await fetchUserPermissions(userData.role_id);
          } else {
            console.warn('⚠️ User has no role assigned');
          }
        } else {
          console.log('ℹ️ No stored user found');
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ==================== LOG PERMISSION CHANGES ====================
  
  useEffect(() => {
    if (permissions.length > 0) {
      console.log('📊 Current permissions:', permissions);
      console.log('📊 Permission count:', permissions.length);
      console.log('📊 Unique modules:', [...new Set(permissions.map(p => p.module_name))]);
    }
  }, [permissions]);

  // ==================== CONTEXT VALUE ====================
  
  const value = {
    user,
    permissions,
    loading,
    login,
    logout,
    updateUser,
    hasPermission,
    hasModuleAccess,
    hasPathAccess,
    refreshPermissions,
    fetchUserRole,
    fetchUserPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};