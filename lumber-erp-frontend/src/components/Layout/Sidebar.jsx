import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  UserCog,
  User as UserIcon,
  Briefcase,
  Building,
  TreePine,
  Factory,
  CheckCircle,
  Package,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  Truck,
  FileText,
  ChevronDown,
  Lock,
  AlertCircle,
  Loader
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const API_URL = 'http://localhost:5000/api';

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user || !user.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Fetching permissions for user:', user.user_id);

        // Step 1: Get user's role
        const rolesResponse = await axios.get(`${API_URL}/roles`);
        const userRole = rolesResponse.data.find(role => role.user_id === user.user_id);
        
        if (!userRole) {
          console.warn('⚠️ No role found for user');
          setUserPermissions([]);
          setLoading(false);
          return;
        }

        console.log('✅ User role:', userRole);

        // Step 2: Get role permissions (role_id + permission_id pairs)
        const rolePermsResponse = await axios.get(`${API_URL}/rolepermissions`);
        const userRolePerms = rolePermsResponse.data.filter(
          rp => rp.role_id === userRole.role_id
        );

        console.log('📋 Role permission mappings:', userRolePerms);

        // Step 3: Get all permissions details
        const permissionsResponse = await axios.get(`${API_URL}/permissions`);
        const allPermissions = permissionsResponse.data;

        console.log('📚 All permissions:', allPermissions);

        // Step 4: Match permission IDs to get full permission details
        const userPermissionDetails = userRolePerms.map(rp => {
          const permDetail = allPermissions.find(p => p.permission_id === rp.permission_id);
          return permDetail;
        }).filter(Boolean); // Remove any undefined matches

        console.log('✅ User permissions:', userPermissionDetails);
        setUserPermissions(userPermissionDetails);

      } catch (error) {
        console.error('❌ Error fetching permissions:', error);
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user]);

  // Check if user has permission
  const hasPermission = (moduleName, actionType) => {
    if (!userPermissions || userPermissions.length === 0) {
      return false;
    }

    return userPermissions.some(
      perm => perm.module_name === moduleName && perm.action_type === actionType
    );
  };

  // Check if user has ANY permission for a path
  const hasPathPermission = (path) => {
    const routePermissions = {
      '/': true,  // Always accessible
      '/profile': true,  // Always accessible
      '/users': [
        { module: 'Users', action: 'View' },
        { module: 'User Management', action: 'READ' },
        { module: 'User Management', action: 'CREATE' },
      ],
      '/permissions': [
        { module: 'Permissions', action: 'View' },
        { module: 'User Management', action: 'READ' },
      ],
      '/roles': [
        { module: 'Roles', action: 'View' },
        { module: 'User Management', action: 'READ' },
      ],
      '/role-permissions': [
        { module: 'RolePermissions', action: 'View' },
        { module: 'User Management', action: 'READ' },
      ],
      '/employees': [
        { module: 'Employees', action: 'View' },
        { module: 'HR & Employees', action: 'READ' },
      ],
      '/worker-assignments': [
        { module: 'WorkerAssignments', action: 'View' },
        { module: 'HR & Employees', action: 'READ' },
      ],
      '/management-insights': [
        { module: 'ManagementInsights', action: 'View' },
        { module: 'HR & Employees', action: 'READ' },
      ],
      '/suppliers': [
        { module: 'Suppliers', action: 'View' },
      ],
      '/supplier-performance': [
        { module: 'SupplierPerformance', action: 'View' },
        { module: 'Suppliers', action: 'READ' },
      ],
      '/supplier-contracts': [
        { module: 'SupplierContracts', action: 'View' },
        { module: 'Suppliers', action: 'READ' },
      ],
      '/forests': [
        { module: 'Forests', action: 'View' },
      ],
      '/tree-species': [
        { module: 'TreeSpecies', action: 'View' },
      ],
      '/harvest-schedules': [
        { module: 'HarvestSchedules', action: 'View' },
      ],
      '/harvest-batches': [
        { module: 'HarvestBatches', action: 'View' },
      ],
      '/sawmills': [
        { module: 'Sawmills', action: 'View' },
      ],
      '/processing-units': [
        { module: 'ProcessingUnits', action: 'View' },
      ],
      '/processing-orders': [
        { module: 'ProcessingOrders', action: 'View' },
      ],
      '/maintenance-records': [
        { module: 'MaintenanceRecords', action: 'View' },
      ],
      '/waste-records': [
        { module: 'WasteRecords', action: 'View' },
      ],
      '/quality-inspections': [
        { module: 'QualityInspections', action: 'View' },
      ],
      '/warehouses': [
        { module: 'Warehouses', action: 'View' },
      ],
      '/product-types': [
        { module: 'ProductTypes', action: 'View' },
      ],
      '/stock-items': [
        { module: 'StockItems', action: 'View' },
      ],
      '/stock-alerts': [
        { module: 'StockAlerts', action: 'View' },
      ],
      '/inventory-transactions': [
        { module: 'InventoryTransactions', action: 'View' },
      ],
      '/purchase-orders': [
        { module: 'PurchaseOrders', action: 'View' },
      ],
      '/purchase-order-items': [
        { module: 'PurchaseOrderItems', action: 'View' },
      ],
      '/customers': [
        { module: 'Customers', action: 'View' },
      ],
      '/sales-orders': [
        { module: 'SalesOrders', action: 'View' },
      ],
      '/sales-order-items': [
        { module: 'SalesOrderItems', action: 'View' },
      ],
      '/invoices': [
        { module: 'Invoices', action: 'View' },
      ],
      '/payments': [
        { module: 'Payments', action: 'View' },
      ],
      '/transport-companies': [
        { module: 'TransportCompanies', action: 'View' },
      ],
      '/trucks': [
        { module: 'Trucks', action: 'View' },
      ],
      '/drivers': [
        { module: 'Drivers', action: 'View' },
      ],
      '/routes': [
        { module: 'Routes', action: 'View' },
      ],
      '/shipments': [
        { module: 'Shipments', action: 'View' },
      ],
      '/fuel-logs': [
        { module: 'FuelLogs', action: 'View' },
      ],
    };

    const requiredPerms = routePermissions[path];
    
    // If true (dashboard/profile), always allow
    if (requiredPerms === true) {
      return true;
    }

    // If no permissions defined, deny
    if (!requiredPerms) {
      return false;
    }

    // If no user permissions, deny
    if (!userPermissions || userPermissions.length === 0) {
      return false;
    }

    // Check if user has ANY of the required permissions
    return requiredPerms.some(reqPerm => 
      hasPermission(reqPerm.module, reqPerm.action)
    );
  };

  const allMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', alwaysShow: true },
    { path: '/profile', icon: UserIcon, label: 'My Profile', alwaysShow: true },
    
    {
      label: 'User Management',
      icon: Users,
      key: 'users',
      children: [
        { path: '/users', label: 'Users' },
        { path: '/permissions', label: 'Permissions' },
        { path: '/roles', label: 'Roles' },
        { path: '/role-permissions', label: 'Role Permissions' },
      ]
    },
    
    {
      label: 'HR & Employees',
      icon: Briefcase,
      key: 'hr',
      children: [
        { path: '/employees', label: 'Employees' },
        { path: '/worker-assignments', label: 'Assignments' },
        { path: '/management-insights', label: 'Insights' },
      ]
    },
    
    {
      label: 'Suppliers',
      icon: Building,
      key: 'suppliers',
      children: [
        { path: '/suppliers', label: 'Suppliers' },
        { path: '/supplier-performance', label: 'Performance' },
        { path: '/supplier-contracts', label: 'Contracts' },
      ]
    },
    
    {
      label: 'Forest & Harvesting',
      icon: TreePine,
      key: 'forest',
      children: [
        { path: '/forests', label: 'Forests' },
        { path: '/tree-species', label: 'Tree Species' },
        { path: '/harvest-schedules', label: 'Schedules' },
        { path: '/harvest-batches', label: 'Batches' },
      ]
    },
    
    {
      label: 'Processing',
      icon: Factory,
      key: 'processing',
      children: [
        { path: '/sawmills', label: 'Sawmills' },
        { path: '/processing-units', label: 'Units' },
        { path: '/processing-orders', label: 'Orders' },
        { path: '/maintenance-records', label: 'Maintenance' },
        { path: '/waste-records', label: 'Waste' },
      ]
    },
    
    { path: '/quality-inspections', icon: CheckCircle, label: 'Quality Control' },
    
    {
      label: 'Warehouse',
      icon: Package,
      key: 'warehouse',
      children: [
        { path: '/warehouses', label: 'Warehouses' },
        { path: '/product-types', label: 'Product Types' },
        { path: '/stock-items', label: 'Stock Items' },
        { path: '/stock-alerts', label: 'Alerts' },
        { path: '/inventory-transactions', label: 'Transactions' },
      ]
    },
    
    {
      label: 'Procurement',
      icon: ShoppingCart,
      key: 'procurement',
      children: [
        { path: '/purchase-orders', label: 'Purchase Orders' },
        { path: '/purchase-order-items', label: 'PO Items' },
      ]
    },
    
    {
      label: 'Sales',
      icon: ShoppingBag,
      key: 'sales',
      children: [
        { path: '/customers', label: 'Customers' },
        { path: '/sales-orders', label: 'Sales Orders' },
        { path: '/sales-order-items', label: 'SO Items' },
      ]
    },
    
    {
      label: 'Financial',
      icon: DollarSign,
      key: 'financial',
      children: [
        { path: '/invoices', label: 'Invoices' },
        { path: '/payments', label: 'Payments' },
      ]
    },
    
    {
      label: 'Transportation',
      icon: Truck,
      key: 'transport',
      children: [
        { path: '/transport-companies', label: 'Companies' },
        { path: '/trucks', label: 'Trucks' },
        { path: '/drivers', label: 'Drivers' },
        { path: '/routes', label: 'Routes' },
        { path: '/shipments', label: 'Shipments' },
        { path: '/fuel-logs', label: 'Fuel Logs' },
      ]
    },
  ];

  const filteredMenuItems = useMemo(() => {
    if (!user) return [];

    return allMenuItems.filter(item => {
      if (item.alwaysShow) {
        return true;
      }

      if (item.children) {
        const accessibleChildren = item.children.filter(child => 
          hasPathPermission(child.path)
        );
        
        if (accessibleChildren.length > 0) {
          item.children = accessibleChildren;
          return true;
        }
        return false;
      }

      if (item.path) {
        return hasPathPermission(item.path);
      }

      return false;
    });
  }, [user, userPermissions]);

  const renderMenuItem = (item, index) => {
    if (item.children) {
      return (
        <div key={item.key} className="nav-group">
          <button 
            className={`nav-item nav-group-header ${openMenus[item.key] ? 'open' : ''}`}
            onClick={() => toggleMenu(item.key)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            <ChevronDown size={16} className="chevron" />
          </button>
          {openMenus[item.key] && (
            <div className="nav-submenu">
              {item.children.map((child, idx) => (
                <NavLink
                  key={idx}
                  to={child.path}
                  className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        end={item.path === '/'}
      >
        <item.icon size={20} />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <div className="sidebar-loading">
          <Loader size={32} className="spinner" />
          <p>Loading menu...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">🌲 Lumber ERP</h2>
        {user && (
          <div className="user-badge">
            <div className="user-avatar">
              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
            </div>
            <div className="user-info">
              <p className="user-name">{user.first_name} {user.last_name}</p>
              <p className="user-role">{user.role_name || 'No Role'}</p>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {!user ? (
          <div className="sidebar-empty">
            <AlertCircle size={32} />
            <p>Not logged in</p>
          </div>
        ) : filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item, index) => renderMenuItem(item, index))
        ) : (
          <div className="sidebar-empty">
            <Lock size={32} />
            <p>No Access</p>
            <small>Contact administrator</small>
          </div>
        )}
      </nav>
      
      <div className="sidebar-footer">
        {user && (
          <div className="permission-count">
            <Shield size={14} />
            <span>{userPermissions.length} permission(s)</span>
          </div>
        )}
        <p className="version">Version 1.0.0</p>
        <p className="copyright">© 2024 Lumber ERP</p>
      </div>
    </aside>
  );
};

export default Sidebar;