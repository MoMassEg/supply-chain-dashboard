import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Layout
import Layout from './components/Layout/Layout';

// Core
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';

// User Management
import UserList from './components/Users/UserList';
import PermissionList from './components/Permissions/PermissionList';
import RoleList from './components/Roles/RoleList';
import RolePermissionList from './components/RolePermissions/RolePermissionList';


// HR & Employees
import EmployeeList from './components/Employees/EmployeeList';
import WorkerAssignments from './components/Employees/WorkerAssignments';
import ManagementInsights from './components/Employees/ManagementInsights';

// Suppliers
import SupplierList from './components/Suppliers/SupplierList';
import SupplierPerformance from './components/Suppliers/SupplierPerformance';
import SupplierContracts from './components/Suppliers/SupplierContracts';

// Forest & Harvesting
import ForestList from './components/Forest/ForestList';
import TreeSpeciesList from './components/Forest/TreeSpeciesList';
import HarvestSchedules from './components/Forest/HarvestSchedules';
import HarvestBatches from './components/Forest/HarvestBatches';

// Processing & Sawmill
import SawmillList from './components/Processing/SawmillList';
import ProcessingUnits from './components/Processing/ProcessingUnits';
import ProcessingOrders from './components/Processing/ProcessingOrders';
import MaintenanceRecords from './components/Processing/MaintenanceRecords';
import WasteRecords from './components/Processing/WasteRecords';

// Quality Control
import QualityInspections from './components/Quality/QualityInspections';

// Warehouse & Inventory
import WarehouseList from './components/Warehouse/WarehouseList';
import ProductTypes from './components/Warehouse/ProductTypes';
import StockItems from './components/Warehouse/StockItems';
import StockAlerts from './components/Warehouse/StockAlerts';
import InventoryTransactions from './components/Warehouse/InventoryTransactions';

// Procurement
import PurchaseOrders from './components/Procurement/PurchaseOrders';
import PurchaseOrderItems from './components/Procurement/PurchaseOrderItems';

// Sales & Customers
import CustomerList from './components/Sales/CustomerList';
import SalesOrders from './components/Sales/SalesOrders';
import SalesOrderItems from './components/Sales/SalesOrderItems';

// Financial
import Invoices from './components/Financial/Invoices';
import Payments from './components/Financial/Payments';

// Transportation
import TransportCompanies from './components/Transportation/TransportCompanies';
import Trucks from './components/Transportation/Trucks';
import Drivers from './components/Transportation/Drivers';
import RoutesList from './components/Transportation/RoutesList';
import Shipments from './components/Transportation/Shipments';
import FuelLogs from './components/Transportation/FuelLogs';


import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            
            {/* User Management */}
            <Route path="users" element={<UserList />} />
            <Route path="permissions" element={<PermissionList />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="/role-permissions" element={<RolePermissionList />} />
            
            {/* HR & Employees */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="worker-assignments" element={<WorkerAssignments />} />
            <Route path="management-insights" element={<ManagementInsights />} />
            
            {/* Suppliers */}
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="supplier-performance" element={<SupplierPerformance />} />
            <Route path="supplier-contracts" element={<SupplierContracts />} />
            
            {/* Forest & Harvesting */}
            <Route path="forests" element={<ForestList />} />
            <Route path="tree-species" element={<TreeSpeciesList />} />
            <Route path="harvest-schedules" element={<HarvestSchedules />} />
            <Route path="harvest-batches" element={<HarvestBatches />} />
            
            {/* Processing & Sawmill */}
            <Route path="sawmills" element={<SawmillList />} />
            <Route path="processing-units" element={<ProcessingUnits />} />
            <Route path="processing-orders" element={<ProcessingOrders />} />
            <Route path="maintenance-records" element={<MaintenanceRecords />} />
            <Route path="waste-records" element={<WasteRecords />} />
            
            {/* Quality Control */}
            <Route path="quality-inspections" element={<QualityInspections />} />
            
            {/* Warehouse & Inventory */}
            <Route path="warehouses" element={<WarehouseList />} />
            <Route path="product-types" element={<ProductTypes />} />
            <Route path="stock-items" element={<StockItems />} />
            <Route path="stock-alerts" element={<StockAlerts />} />
            <Route path="inventory-transactions" element={<InventoryTransactions />} />
            
            {/* Procurement */}
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="purchase-order-items" element={<PurchaseOrderItems />} />
            
            {/* Sales & Customers */}
            <Route path="customers" element={<CustomerList />} />
            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="sales-order-items" element={<SalesOrderItems />} />
            
            {/* Financial */}
            <Route path="invoices" element={<Invoices />} />
            <Route path="payments" element={<Payments />} />
            
            {/* Transportation */}
            <Route path="transport-companies" element={<TransportCompanies />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="routes" element={<RoutesList />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="fuel-logs" element={<FuelLogs />} />
            
           
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;