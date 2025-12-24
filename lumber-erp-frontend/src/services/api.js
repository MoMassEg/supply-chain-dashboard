import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// ===== USER MANAGEMENT =====
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/user?id=${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/user?id=${id}`, data),
  delete: (id) => api.delete(`/user?id=${id}`),
};

export const permissionsAPI = {
  getAll: () => api.get('/permissions'),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.put(`/permission?id=${id}`, data),
  delete: (id) => api.delete(`/permission?id=${id}`),
};

export const rolesAPI = {
  getAll: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/role?id=${id}`, data),
  delete: (id) => api.delete(`/role?id=${id}`),
};

// ===== HR & EMPLOYEES =====
export const employeesAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employee?id=${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employee?id=${id}`, data),
  delete: (id) => api.delete(`/employee?id=${id}`),
};

export const workerAssignmentsAPI = {
  getAll: () => api.get('/workerassignments'),
  create: (data) => api.post('/workerassignments', data),
  update: (id, data) => api.put(`/workerassignment?id=${id}`, data),
  delete: (id) => api.delete(`/workerassignment?id=${id}`),
};

export const managementInsightsAPI = {
  getAll: () => api.get('/managementinsights'),
  create: (data) => api.post('/managementinsights', data),
  update: (id, data) => api.put(`/managementinsight?id=${id}`, data),
  delete: (id) => api.delete(`/managementinsight?id=${id}`),
};

// ===== SUPPLIERS =====
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/supplier?id=${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/supplier?id=${id}`, data),
  delete: (id) => api.delete(`/supplier?id=${id}`),
};

export const supplierPerformanceAPI = {
  getAll: () => api.get('/supplierperformances'),
  create: (data) => api.post('/supplierperformances', data),
  update: (id, data) => api.put(`/supplierperformance?id=${id}`, data),
  delete: (id) => api.delete(`/supplierperformance?id=${id}`),
};

export const supplierContractsAPI = {
  getAll: () => api.get('/suppliercontracts'),
  create: (data) => api.post('/suppliercontracts', data),
  update: (id, data) => api.put(`/suppliercontract?id=${id}`, data),
  delete: (id) => api.delete(`/suppliercontract?id=${id}`),
};

// ===== FOREST & HARVESTING =====
export const forestsAPI = {
  getAll: () => api.get('/forests'),
  getById: (id) => api.get(`/forest?id=${id}`),
  create: (data) => api.post('/forests', data),
  update: (id, data) => api.put(`/forest?id=${id}`, data),
  delete: (id) => api.delete(`/forest?id=${id}`),
};

export const treeSpeciesAPI = {
  getAll: () => api.get('/treespecies'),
  create: (data) => api.post('/treespecies', data),
  update: (id, data) => api.put(`/treespecies-item?id=${id}`, data),
  delete: (id) => api.delete(`/treespecies-item?id=${id}`),
};

export const harvestSchedulesAPI = {
  getAll: () => api.get('/harvestschedules'),
  create: (data) => api.post('/harvestschedules', data),
  update: (id, data) => api.put(`/harvestschedule?id=${id}`, data),
  delete: (id) => api.delete(`/harvestschedule?id=${id}`),
};

export const harvestBatchesAPI = {
  getAll: () => api.get('/harvestbatches'),
  create: (data) => api.post('/harvestbatches', data),
  update: (id, data) => api.put(`/harvestbatch?id=${id}`, data),
  delete: (id) => api.delete(`/harvestbatch?id=${id}`),
};

// ===== PROCESSING & SAWMILL =====
export const sawmillsAPI = {
  getAll: () => api.get('/sawmills'),
  create: (data) => api.post('/sawmills', data),
  update: (id, data) => api.put(`/sawmill?id=${id}`, data),
  delete: (id) => api.delete(`/sawmill?id=${id}`),
};

export const processingUnitsAPI = {
  getAll: () => api.get('/processingunits'),
  create: (data) => api.post('/processingunits', data),
  update: (id, data) => api.put(`/processingunit?id=${id}`, data),
  delete: (id) => api.delete(`/processingunit?id=${id}`),
};

export const processingOrdersAPI = {
  getAll: () => api.get('/processingorders'),
  create: (data) => api.post('/processingorders', data),
  update: (id, data) => api.put(`/processingorder?id=${id}`, data),
  delete: (id) => api.delete(`/processingorder?id=${id}`),
};

export const maintenanceRecordsAPI = {
  getAll: () => api.get('/maintenancerecords'),
  create: (data) => api.post('/maintenancerecords', data),
  update: (id, data) => api.put(`/maintenancerecord?id=${id}`, data),
  delete: (id) => api.delete(`/maintenancerecord?id=${id}`),
};

export const wasteRecordsAPI = {
  getAll: () => api.get('/wasterecords'),
  create: (data) => api.post('/wasterecords', data),
  update: (id, data) => api.put(`/wasterecord?id=${id}`, data),
  delete: (id) => api.delete(`/wasterecord?id=${id}`),
};

// ===== QUALITY CONTROL =====
export const qualityInspectionsAPI = {
  getAll: () => api.get('/qualityinspections'),
  create: (data) => api.post('/qualityinspections', data),
  update: (id, data) => api.put(`/qualityinspection?id=${id}`, data),
  delete: (id) => api.delete(`/qualityinspection?id=${id}`),
};

// ===== WAREHOUSE & INVENTORY =====
export const warehousesAPI = {
  getAll: () => api.get('/warehouses'),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouse?id=${id}`, data),
  delete: (id) => api.delete(`/warehouse?id=${id}`),
};

export const productTypesAPI = {
  getAll: () => api.get('/producttypes'),
  create: (data) => api.post('/producttypes', data),
  update: (id, data) => api.put(`/producttype?id=${id}`, data),
  delete: (id) => api.delete(`/producttype?id=${id}`),
};

export const stockItemsAPI = {
  getAll: () => api.get('/stockitems'),
  create: (data) => api.post('/stockitems', data),
  update: (id, data) => api.put(`/stockitem?id=${id}`, data),
  delete: (id) => api.delete(`/stockitem?id=${id}`),
};

export const stockAlertsAPI = {
  getAll: () => api.get('/stockalerts'),
  create: (data) => api.post('/stockalerts', data),
  update: (id, data) => api.put(`/stockalert?id=${id}`, data),
  delete: (id) => api.delete(`/stockalert?id=${id}`),
};

export const inventoryTransactionsAPI = {
  getAll: () => api.get('/inventorytransactions'),
  create: (data) => api.post('/inventorytransactions', data),
  update: (id, data) => api.put(`/inventorytransaction?id=${id}`, data),
  delete: (id) => api.delete(`/inventorytransaction?id=${id}`),
};

// ===== PROCUREMENT =====
export const purchaseOrdersAPI = {
  getAll: () => api.get('/purchaseorders'),
  create: (data) => api.post('/purchaseorders', data),
  update: (id, data) => api.put(`/purchaseorder?id=${id}`, data),
  delete: (id) => api.delete(`/purchaseorder?id=${id}`),
};

export const purchaseOrderItemsAPI = {
  getAll: () => api.get('/purchaseorderitems'),
  create: (data) => api.post('/purchaseorderitems', data),
  update: (id, data) => api.put(`/purchaseorderitem?id=${id}`, data),
  delete: (id) => api.delete(`/purchaseorderitem?id=${id}`),
};

// ===== SALES & CUSTOMERS =====
export const customersAPI = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customer?id=${id}`, data),
  delete: (id) => api.delete(`/customer?id=${id}`),
};

export const salesOrdersAPI = {
  getAll: () => api.get('/salesorders'),
  create: (data) => api.post('/salesorders', data),
  update: (id, data) => api.put(`/salesorder?id=${id}`, data),
  delete: (id) => api.delete(`/salesorder?id=${id}`),
};

export const salesOrderItemsAPI = {
  getAll: () => api.get('/salesorderitems'),
  create: (data) => api.post('/salesorderitems', data),
  update: (id, data) => api.put(`/salesorderitem?id=${id}`, data),
  delete: (id) => api.delete(`/salesorderitem?id=${id}`),
};

// ===== INVOICING & PAYMENTS =====
export const invoicesAPI = {
  getAll: () => api.get('/invoices'),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoice?id=${id}`, data),
  delete: (id) => api.delete(`/invoice?id=${id}`),
};

export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payment?id=${id}`, data),
  delete: (id) => api.delete(`/payment?id=${id}`),
};

// ===== TRANSPORTATION =====
export const transportCompaniesAPI = {
  getAll: () => api.get('/transportcompanies'),
  create: (data) => api.post('/transportcompanies', data),
  update: (id, data) => api.put(`/transportcompany?id=${id}`, data),
  delete: (id) => api.delete(`/transportcompany?id=${id}`),
};

export const trucksAPI = {
  getAll: () => api.get('/trucks'),
  create: (data) => api.post('/trucks', data),
  update: (id, data) => api.put(`/truck?id=${id}`, data),
  delete: (id) => api.delete(`/truck?id=${id}`),
};

export const driversAPI = {
  getAll: () => api.get('/drivers'),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/driver?id=${id}`, data),
  delete: (id) => api.delete(`/driver?id=${id}`),
};

export const routesAPI = {
  getAll: () => api.get('/routes'),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/route?id=${id}`, data),
  delete: (id) => api.delete(`/route?id=${id}`),
};

export const shipmentsAPI = {
  getAll: () => api.get('/shipments'),
  create: (data) => api.post('/shipments', data),
  update: (id, data) => api.put(`/shipment?id=${id}`, data),
  delete: (id) => api.delete(`/shipment?id=${id}`),
};

export const fuelLogsAPI = {
  getAll: () => api.get('/fuellogs'),
  create: (data) => api.post('/fuellogs', data),
  update: (id, data) => api.put(`/fuellog?id=${id}`, data),
  delete: (id) => api.delete(`/fuellog?id=${id}`),
};

// ===== AUDIT & LOGS =====
export const auditLogsAPI = {
  getAll: () => api.get('/auditlogs'),
  create: (data) => api.post('/auditlogs', data),
};

export default api;


// ===== ROLE PERMISSIONS =====
export const rolePermissionsAPI = {
  getAll: () => api.get('/rolepermissions'),
  getByRole: (roleId) => api.get(`/rolepermissions/role?id=${roleId}`),
  getByPermission: (permissionId) => api.get(`/rolepermissions/permission?id=${permissionId}`),
  create: (data) => api.post('/rolepermissions', data),
  delete: (roleId, permissionId) => api.delete(`/rolepermission?role_id=${roleId}&permission_id=${permissionId}`),
  assignPermissions: (roleId, permissionIds) => api.post('/rolepermissions/assign', { role_id: roleId, permission_ids: permissionIds }),
};