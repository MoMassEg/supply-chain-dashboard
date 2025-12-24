import React from 'react';
import { NavLink } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = React.useState({});

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: UserIcon, label: 'My Profile' },
    
    // User Management
    {
      label: 'User Management',
      icon: Users,
      key: 'users',
      children: [
        { path: '/users', label: 'Users' },
        { path: '/permissions', label: 'Permissions' },
        { path: '/roles', label: 'Roles' },
        { path: '/role-permissions', label: 'role-permissions' },
      ]
    },
    
    // HR & Employees
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
    
    // Suppliers
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
    
    // Forest & Harvesting
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
    
    // Processing & Sawmill
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
    
    // Quality Control
    { path: '/quality-inspections', icon: CheckCircle, label: 'Quality Control' },
    
    // Warehouse & Inventory
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
    
    // Procurement
    {
      label: 'Procurement',
      icon: ShoppingCart,
      key: 'procurement',
      children: [
        { path: '/purchase-orders', label: 'Purchase Orders' },
        { path: '/purchase-order-items', label: 'PO Items' },
      ]
    },
    
    // Sales & Customers
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
    
    // Financial
    {
      label: 'Financial',
      icon: DollarSign,
      key: 'financial',
      children: [
        { path: '/invoices', label: 'Invoices' },
        { path: '/payments', label: 'Payments' },
      ]
    },
    
    // Transportation
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

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>
      
      <div className="sidebar-footer">
        <p className="version">Version 1.0.0</p>
        <p className="copyright">© 2024 Lumber ERP</p>
      </div>
    </aside>
  );
};

export default Sidebar;