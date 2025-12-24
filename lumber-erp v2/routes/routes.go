package routes

import (
	"net/http"

	"lumber-erp-api/handlers"
	"lumber-erp-api/utils"
)

// SetupRoutes configures all API routes
func SetupRoutes() {
	// Health check
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		utils.EnableCORS(&w)
		utils.RespondJSON(w, http.StatusOK, map[string]string{
			"message": "🌲 Lumber ERP API v2.0",
			"status":  "running",
			"author":  "ERP Development Team",
		})
	})

	// ==================== USER MANAGEMENT ====================
	http.HandleFunc("/api/users", HandleRequest(handlers.GetUsers, handlers.CreateUser, nil, nil))
	http.HandleFunc("/api/user", HandleRequest(handlers.GetUser, nil, handlers.UpdateUser, handlers.DeleteUser))
	
	http.HandleFunc("/api/permissions", HandleRequest(handlers.GetPermissions, handlers.CreatePermission, nil, nil))
	http.HandleFunc("/api/permission", HandleRequest(nil, nil, handlers.UpdatePermission, handlers.DeletePermission))
	
	http.HandleFunc("/api/roles", HandleRequest(handlers.GetRoles, handlers.CreateRole, nil, nil))
	http.HandleFunc("/api/role", HandleRequest(nil, nil, handlers.UpdateRole, handlers.DeleteRole))

	// ==================== HR & EMPLOYEES ====================
	http.HandleFunc("/api/employees", HandleRequest(handlers.GetEmployees, handlers.CreateEmployee, nil, nil))
	http.HandleFunc("/api/employee", HandleRequest(nil, nil, handlers.UpdateEmployee, handlers.DeleteEmployee))
	
	http.HandleFunc("/api/workerassignments", HandleRequest(handlers.GetWorkerAssignments, handlers.CreateWorkerAssignment, nil, nil))
	http.HandleFunc("/api/workerassignment", HandleRequest(nil, nil, handlers.UpdateWorkerAssignment, handlers.DeleteWorkerAssignment))
	
	http.HandleFunc("/api/managementinsights", HandleRequest(handlers.GetManagementInsights, handlers.CreateManagementInsights, nil, nil))
	http.HandleFunc("/api/managementinsight", HandleRequest(nil, nil, handlers.UpdateManagementInsights, handlers.DeleteManagementInsights))

	// ==================== SUPPLIERS ====================
	http.HandleFunc("/api/suppliers", HandleRequest(handlers.GetSuppliers, handlers.CreateSupplier, nil, nil))
	http.HandleFunc("/api/supplier", HandleRequest(nil, nil, handlers.UpdateSupplier, handlers.DeleteSupplier))
	
	http.HandleFunc("/api/supplierperformances", HandleRequest(handlers.GetSupplierPerformances, handlers.CreateSupplierPerformance, nil, nil))
	http.HandleFunc("/api/supplierperformance", HandleRequest(nil, nil, handlers.UpdateSupplierPerformance, handlers.DeleteSupplierPerformance))
	
	http.HandleFunc("/api/suppliercontracts", HandleRequest(handlers.GetSupplierContracts, handlers.CreateSupplierContract, nil, nil))
	http.HandleFunc("/api/suppliercontract", HandleRequest(nil, nil, handlers.UpdateSupplierContract, handlers.DeleteSupplierContract))

	// ==================== FOREST & HARVESTING ====================
	http.HandleFunc("/api/forests", HandleRequest(handlers.GetForests, handlers.CreateForest, nil, nil))
	http.HandleFunc("/api/forest", HandleRequest(nil, nil, handlers.UpdateForest, handlers.DeleteForest))
	
	http.HandleFunc("/api/treespecies", HandleRequest(handlers.GetTreeSpecies, handlers.CreateTreeSpecies, nil, nil))
	http.HandleFunc("/api/treespecies-item", HandleRequest(nil, nil, handlers.UpdateTreeSpecies, handlers.DeleteTreeSpecies))
	
	http.HandleFunc("/api/harvestschedules", HandleRequest(handlers.GetHarvestSchedules, handlers.CreateHarvestSchedule, nil, nil))
	http.HandleFunc("/api/harvestschedule", HandleRequest(nil, nil, handlers.UpdateHarvestSchedule, handlers.DeleteHarvestSchedule))
	
	http.HandleFunc("/api/harvestbatches", HandleRequest(handlers.GetHarvestBatches, handlers.CreateHarvestBatch, nil, nil))
	http.HandleFunc("/api/harvestbatch", HandleRequest(nil, nil, handlers.UpdateHarvestBatch, handlers.DeleteHarvestBatch))

	// ==================== PROCESSING & SAWMILL ====================
	http.HandleFunc("/api/sawmills", HandleRequest(handlers.GetSawmills, handlers.CreateSawmill, nil, nil))
	http.HandleFunc("/api/sawmill", HandleRequest(nil, nil, handlers.UpdateSawmill, handlers.DeleteSawmill))
	
	http.HandleFunc("/api/processingunits", HandleRequest(handlers.GetProcessingUnits, handlers.CreateProcessingUnit, nil, nil))
	http.HandleFunc("/api/processingunit", HandleRequest(nil, nil, handlers.UpdateProcessingUnit, handlers.DeleteProcessingUnit))
	
	http.HandleFunc("/api/processingorders", HandleRequest(handlers.GetProcessingOrders, handlers.CreateProcessingOrder, nil, nil))
	http.HandleFunc("/api/processingorder", HandleRequest(nil, nil, handlers.UpdateProcessingOrder, handlers.DeleteProcessingOrder))
	
	http.HandleFunc("/api/maintenancerecords", HandleRequest(handlers.GetMaintenanceRecords, handlers.CreateMaintenanceRecord, nil, nil))
	http.HandleFunc("/api/maintenancerecord", HandleRequest(nil, nil, handlers.UpdateMaintenanceRecord, handlers.DeleteMaintenanceRecord))
	
	http.HandleFunc("/api/wasterecords", HandleRequest(handlers.GetWasteRecords, handlers.CreateWasteRecord, nil, nil))
	http.HandleFunc("/api/wasterecord", HandleRequest(nil, nil, handlers.UpdateWasteRecord, handlers.DeleteWasteRecord))

	// ==================== QUALITY CONTROL ====================
	http.HandleFunc("/api/qualityinspections", HandleRequest(handlers.GetQualityInspections, handlers.CreateQualityInspection, nil, nil))
	http.HandleFunc("/api/qualityinspection", HandleRequest(nil, nil, handlers.UpdateQualityInspection, handlers.DeleteQualityInspection))

	// ==================== WAREHOUSE & INVENTORY ====================
	http.HandleFunc("/api/warehouses", HandleRequest(handlers.GetWarehouses, handlers.CreateWarehouse, nil, nil))
	http.HandleFunc("/api/warehouse", HandleRequest(nil, nil, handlers.UpdateWarehouse, handlers.DeleteWarehouse))
	
	http.HandleFunc("/api/producttypes", HandleRequest(handlers.GetProductTypes, handlers.CreateProductType, nil, nil))
	http.HandleFunc("/api/producttype", HandleRequest(nil, nil, handlers.UpdateProductType, handlers.DeleteProductType))
	
	http.HandleFunc("/api/stockitems", HandleRequest(handlers.GetStockItems, handlers.CreateStockItem, nil, nil))
	http.HandleFunc("/api/stockitem", HandleRequest(nil, nil, handlers.UpdateStockItem, handlers.DeleteStockItem))
	
	http.HandleFunc("/api/stockalerts", HandleRequest(handlers.GetStockAlerts, handlers.CreateStockAlert, nil, nil))
	http.HandleFunc("/api/stockalert", HandleRequest(nil, nil, handlers.UpdateStockAlert, handlers.DeleteStockAlert))
	
	http.HandleFunc("/api/inventorytransactions", HandleRequest(handlers.GetInventoryTransactions, handlers.CreateInventoryTransaction, nil, nil))
	http.HandleFunc("/api/inventorytransaction", HandleRequest(nil, nil, handlers.UpdateInventoryTransaction, handlers.DeleteInventoryTransaction))

	// ==================== PROCUREMENT ====================
	http.HandleFunc("/api/purchaseorders", HandleRequest(handlers.GetPurchaseOrders, handlers.CreatePurchaseOrder, nil, nil))
	http.HandleFunc("/api/purchaseorder", HandleRequest(nil, nil, handlers.UpdatePurchaseOrder, handlers.DeletePurchaseOrder))
	
	http.HandleFunc("/api/purchaseorderitems", HandleRequest(handlers.GetPurchaseOrderItems, handlers.CreatePurchaseOrderItem, nil, nil))
	http.HandleFunc("/api/purchaseorderitem", HandleRequest(nil, nil, handlers.UpdatePurchaseOrderItem, handlers.DeletePurchaseOrderItem))

	// ==================== SALES & CUSTOMERS ====================
	http.HandleFunc("/api/customers", HandleRequest(handlers.GetCustomers, handlers.CreateCustomer, nil, nil))
	http.HandleFunc("/api/customer", HandleRequest(nil, nil, handlers.UpdateCustomer, handlers.DeleteCustomer))
	
	http.HandleFunc("/api/salesorders", HandleRequest(handlers.GetSalesOrders, handlers.CreateSalesOrder, nil, nil))
	http.HandleFunc("/api/salesorder", HandleRequest(nil, nil, handlers.UpdateSalesOrder, handlers.DeleteSalesOrder))
	
	http.HandleFunc("/api/salesorderitems", HandleRequest(handlers.GetSalesOrderItems, handlers.CreateSalesOrderItem, nil, nil))
	http.HandleFunc("/api/salesorderitem", HandleRequest(nil, nil, handlers.UpdateSalesOrderItem, handlers.DeleteSalesOrderItem))

	// ==================== INVOICING & PAYMENTS ====================
	http.HandleFunc("/api/invoices", HandleRequest(handlers.GetInvoices, handlers.CreateInvoice, nil, nil))
	http.HandleFunc("/api/invoice", HandleRequest(nil, nil, handlers.UpdateInvoice, handlers.DeleteInvoice))
	
	http.HandleFunc("/api/payments", HandleRequest(handlers.GetPayments, handlers.CreatePayment, nil, nil))
	http.HandleFunc("/api/payment", HandleRequest(nil, nil, handlers.UpdatePayment, handlers.DeletePayment))

	// ==================== TRANSPORTATION ====================
	http.HandleFunc("/api/transportcompanies", HandleRequest(handlers.GetTransportCompanies, handlers.CreateTransportCompany, nil, nil))
	http.HandleFunc("/api/transportcompany", HandleRequest(nil, nil, handlers.UpdateTransportCompany, handlers.DeleteTransportCompany))
	
	http.HandleFunc("/api/trucks", HandleRequest(handlers.GetTrucks, handlers.CreateTruck, nil, nil))
	http.HandleFunc("/api/truck", HandleRequest(nil, nil, handlers.UpdateTruck, handlers.DeleteTruck))
	
	http.HandleFunc("/api/drivers", HandleRequest(handlers.GetDrivers, handlers.CreateDriver, nil, nil))
	http.HandleFunc("/api/driver", HandleRequest(nil, nil, handlers.UpdateDriver, handlers.DeleteDriver))
	
	http.HandleFunc("/api/routes", HandleRequest(handlers.GetRoutes, handlers.CreateRoute, nil, nil))
	http.HandleFunc("/api/route", HandleRequest(nil, nil, handlers.UpdateRoute, handlers.DeleteRoute))
	
	http.HandleFunc("/api/shipments", HandleRequest(handlers.GetShipments, handlers.CreateShipment, nil, nil))
	http.HandleFunc("/api/shipment", HandleRequest(nil, nil, handlers.UpdateShipment, handlers.DeleteShipment))
	
	http.HandleFunc("/api/fuellogs", HandleRequest(handlers.GetFuelLogs, handlers.CreateFuelLog, nil, nil))
	http.HandleFunc("/api/fuellog", HandleRequest(nil, nil, handlers.UpdateFuelLog, handlers.DeleteFuelLog))

	// ==================== AUDIT & LOGS ====================
	http.HandleFunc("/api/auditlogs", HandleRequest(handlers.GetAuditLogs, handlers.CreateAuditLog, nil, nil))

// ==================== ROLE PERMISSIONS ====================
http.HandleFunc("/api/rolepermissions", HandleRequest(handlers.GetRolePermissions, handlers.CreateRolePermission, nil, nil))
http.HandleFunc("/api/rolepermissions/role", HandleRequest(handlers.GetRolePermissionsByRole, nil, nil, nil))
http.HandleFunc("/api/rolepermissions/permission", HandleRequest(handlers.GetRolePermissionsByPermission, nil, nil, nil))
http.HandleFunc("/api/rolepermissions/assign", HandleRequest(nil, handlers.AssignPermissionsToRole, nil, nil))
http.HandleFunc("/api/rolepermission", HandleRequest(nil, nil, nil, handlers.DeleteRolePermission))
	// Add these routes to your router setup


}

// HandleRequest is a helper function to handle multiple HTTP methods
func HandleRequest(getFn, postFn, putFn, deleteFn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		utils.EnableCORS(&w)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		switch r.Method {
		case "GET":
			if getFn != nil {
				getFn(w, r)
			} else {
				utils.RespondError(w, http.StatusMethodNotAllowed, "GET method not allowed")
			}
		case "POST":
			if postFn != nil {
				postFn(w, r)
			} else {
				utils.RespondError(w, http.StatusMethodNotAllowed, "POST method not allowed")
			}
		case "PUT":
			if putFn != nil {
				putFn(w, r)
			} else {
				utils.RespondError(w, http.StatusMethodNotAllowed, "PUT method not allowed")
			}
		case "DELETE":
			if deleteFn != nil {
				deleteFn(w, r)
			} else {
				utils.RespondError(w, http.StatusMethodNotAllowed, "DELETE method not allowed")
			}
		default:
			utils.RespondError(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	}
}