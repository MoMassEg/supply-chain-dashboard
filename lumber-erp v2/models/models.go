package models

// ============================================
// 👥 USER MANAGEMENT
// ============================================

type User struct {
	UserID      int    `json:"user_id"`
	Email       string `json:"email"`
	Password    string `json:"password,omitempty"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	PhoneNumber string `json:"phone_number"`
	Status      string `json:"status"`
	CreatedAt   string `json:"created_at"`
}

type Permission struct {
	PermissionID int    `json:"permission_id"`
	ModuleName   string `json:"module_name"`
	ActionType   string `json:"action_type"`
}

type Role struct {
	RoleID      int    `json:"role_id"`
	UserID      int    `json:"user_id"`
	RoleName    string `json:"role_name"`
	Description string `json:"description"`
}


type RolePermission struct {
	RoleID       int `json:"role_id"`
	PermissionID int `json:"permission_id"`
}

type UserEmployeeAssignment struct {
	UserID     int `json:"user_id"`
	EmployeeID int `json:"employee_id"`
}

// ============================================
// 👷 HR & EMPLOYEES
// ============================================

type Employee struct {
	EmployeeID        int     `json:"employee_id"`
	FullName          string  `json:"full_name"`
	Department        string  `json:"department"`
	Position          string  `json:"position"`
	HireDate          string  `json:"hire_date"`
	PerformanceRating float64 `json:"performance_rating"`
}

type WorkerAssignment struct {
	AssignmentID int    `json:"assignment_id"`
	EmployeeID   int    `json:"employee_id"`
	ProcessingID int    `json:"processing_id"`
	RoleInTask   string `json:"role_in_task"`
	Notes        string `json:"notes"`
}

type ManagementInsights struct {
	ReportID   int    `json:"report_id"`
	EmployeeID int    `json:"employee_id"`
	KPIType    string `json:"kpi_type"`
	TimePeriod string `json:"time_period"`
}

// ============================================
// 🏭 SUPPLIERS
// ============================================

type Supplier struct {
	SupplierID       int    `json:"supplier_id"`
	CompanyName      string `json:"company_name"`
	ContactPerson    string `json:"contact_person"`
	Email            string `json:"email"`
	Phone            string `json:"phone"`
	ComplianceStatus string `json:"compliance_status"`
	Raw              bool   `json:"raw"`
	SemiProcessed    bool   `json:"semi_processed"`
}

type SupplierPerformance struct {
	PerformanceID      int     `json:"performance_id"`
	SupplierID         int     `json:"supplier_id"`
	Rating             float64 `json:"rating"`
	DeliveryTimeliness float64 `json:"delivery_timeliness"`
	QualityScore       float64 `json:"quality_score"`
	ReviewDate         string  `json:"review_date"`
}

type SupplierContract struct {
	ContractID    int     `json:"contract_id"`
	SupplierID    int     `json:"supplier_id"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
	Terms         string  `json:"terms"`
	ContractValue float64 `json:"contract_value"`
	Status        string  `json:"status"`
}

// ============================================
// 🌲 FOREST & HARVESTING
// ============================================

type Forest struct {
	ForestID      int     `json:"forest_id"`
	ForestName    string  `json:"forest_name"`
	GeoLocation   string  `json:"geo_location"`
	AreaSize      float64 `json:"area_size"`
	OwnershipType string  `json:"ownership_type"`
	Status        string  `json:"status"`
}

type TreeSpecies struct {
	SpeciesID       int     `json:"species_id"`
	SpeciesName     string  `json:"species_name"`
	AverageHeight   float64 `json:"average_height"`
	Density         float64 `json:"density"`
	MoistureContent float64 `json:"moisture_content"`
	Grade           string  `json:"grade"`
}

type HarvestSchedule struct {
	ScheduleID int    `json:"schedule_id"`
	ForestID   int    `json:"forest_id"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	Status     string `json:"status"`
}

type HarvestBatch struct {
	BatchID          int     `json:"batch_id"`
	ForestID         int     `json:"forest_id"`
	SpeciesID        int     `json:"species_id"`
	ScheduleID       int     `json:"schedule_id"`
	Quantity         float64 `json:"quantity"`
	HarvestDate      string  `json:"harvest_date"`
	QualityIndicator string  `json:"quality_indicator"`
	QRCode           string  `json:"qr_code"`
}

type HarvestBatchProcessing struct {
	ProcessingID int `json:"processing_id"`
	BatchID      int `json:"batch_id"`
}

// ============================================
// 🏗️ PROCESSING & SAWMILL
// ============================================

type Sawmill struct {
	SawmillID int     `json:"sawmill_id"`
	Name      string  `json:"name"`
	Location  string  `json:"location"`
	Capacity  float64 `json:"capacity"`
	Status    string  `json:"status"`
}

type ProcessingUnit struct {
	UnitID    int     `json:"unit_id"`
	SawmillID int     `json:"sawmill_id"`
	Cutting   string  `json:"cutting"`
	Drying    string  `json:"drying"`
	Finishing string  `json:"finishing"`
	Capacity  float64 `json:"capacity"`
	Status    string  `json:"status"`
}

type ProcessingOrder struct {
	ProcessingID   int     `json:"processing_id"`
	ProductTypeID  int     `json:"product_type_id"`
	UnitID         int     `json:"unit_id"`
	StartDate      string  `json:"start_date"`
	EndDate        string  `json:"end_date"`
	OutputQuantity float64 `json:"output_quantity"`
	EfficiencyRate float64 `json:"efficiency_rate"`
}

type MaintenanceRecord struct {
	MaintenanceID   int     `json:"maintenance_id"`
	UnitID          int     `json:"unit_id"`
	MaintenanceDate string  `json:"maintenance_date"`
	Description     string  `json:"description"`
	Cost            float64 `json:"cost"`
	PartsUsed       string  `json:"parts_used"`
	DowntimeHours   float64 `json:"downtime_hours"`
}

type WasteRecord struct {
	WasteID        int     `json:"waste_id"`
	ProcessingID   int     `json:"processing_id"`
	WasteType      string  `json:"waste_type"`
	Volume         float64 `json:"volume"`
	DisposalMethod string  `json:"disposal_method"`
	Recycled       bool    `json:"recycled"`
}

// ============================================
// ✅ QUALITY CONTROL
// ============================================


type QualityInspection struct {
	InspectionID    int      `json:"inspection_id"`
	EmployeeID      int      `json:"employee_id"`
	ProcessingID    *int     `json:"processing_id"`   // pointer allows NULL
	POItemID        *int     `json:"po_item_id"`      // pointer allows NULL
	BatchID         int      `json:"batch_id"`
	Result          string   `json:"result"`
	MoistureLevel   float64  `json:"moisture_level"`
	CertificationID string   `json:"certification_id"`
	Date            string   `json:"date"`
}

// ============================================
// 📦 WAREHOUSE & INVENTORY
// ============================================

type Warehouse struct {
	WarehouseID int     `json:"warehouse_id"`
	Name        string  `json:"name"`
	Location    string  `json:"location"`
	Capacity    float64 `json:"capacity"`
	Contact     string  `json:"contact"`
}

type ProductType struct {
	ProductTypeID int    `json:"product_type_id"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	Grade         string `json:"grade"`
	UnitOfMeasure string `json:"unit_of_measure"`
}

type StockItem struct {
	StockID       int     `json:"stock_id"`
	ProductTypeID int     `json:"product_type_id"`
	WarehouseID   int     `json:"warehouse_id"`
	BatchID       int     `json:"batch_id"`
	Quantity      float64 `json:"quantity"`
	ShelfLocation string  `json:"shelf_location"`
}

type StockAlert struct {
	AlertID     int    `json:"alert_id"`
	StockID     int    `json:"stock_id"`
	WarehouseID int    `json:"warehouse_id"`
	AlertType   string `json:"alert_type"`
	CreatedAt   string `json:"created_at"`
	Status      string `json:"status"`
}

type InventoryTransaction struct {
	TransactionID   int     `json:"transaction_id"`
	EmployeeID      int     `json:"employee_id"`
	StockID         int     `json:"stock_id"`
	WarehouseID     int     `json:"warehouse_id"`
	TransactionType string  `json:"transaction_type"`
	Quantity        float64 `json:"quantity"`
	TransactionDate string  `json:"transaction_date"`
	Remarks         string  `json:"remarks"`
}

// ============================================
// 🛒 PROCUREMENT
// ============================================

type PurchaseOrder struct {
	POID                 int     `json:"poid"`
	EmployeeID           int     `json:"employee_id"`
	SupplierID           int     `json:"supplier_id"`
	OrderDate            string  `json:"order_date"`
	ExpectedDeliveryDate string  `json:"expected_delivery_date"`
	Status               string  `json:"status"`
	TotalAmount          float64 `json:"total_amount"`
}

type PurchaseOrderItem struct {
	POItemID      int     `json:"po_item_id"`
	POID          int     `json:"poid"`
	ProductTypeID int     `json:"product_type_id"`
	Quantity      float64 `json:"quantity"`
	UnitPrice     float64 `json:"unit_price"`
	Subtotal      float64 `json:"subtotal"`
}

// ============================================
// 🛍️ SALES & CUSTOMERS
// ============================================

type Customer struct {
	CustomerID  int    `json:"customer_id"`
	Name        string `json:"name"`
	Retailer    bool   `json:"retailer"`
	EndUser     bool   `json:"end_user"`
	ContactInfo string `json:"contact_info"`
	Address     string `json:"address"`
	TaxNumber   string `json:"tax_number"`
}

type SalesOrder struct {
	SOID         int     `json:"soid"`
	EmployeeID   int     `json:"employee_id"`
	CustomerID   int     `json:"customer_id"`
	OrderDate    string  `json:"order_date"`
	DeliveryDate string  `json:"delivery_date"`
	Status       string  `json:"status"`
	TotalAmount  float64 `json:"total_amount"`
}

type SalesOrderItem struct {
	SOItemID      int     `json:"so_item_id"`
	SOID          int     `json:"soid"`
	ProductTypeID int     `json:"product_type_id"`
	Quantity      float64 `json:"quantity"`
	UnitPrice     float64 `json:"unit_price"`
	Discount      float64 `json:"discount"`
	Subtotal      float64 `json:"subtotal"`
}

// ============================================
// 💰 INVOICING & PAYMENTS
// ============================================

type Invoice struct {
	InvoiceID   int     `json:"invoice_id"`
	SOID        int     `json:"soid"`
	InvoiceDate string  `json:"invoice_date"`
	DueDate     string  `json:"due_date"`
	TotalAmount float64 `json:"total_amount"`
	Tax         float64 `json:"tax"`
	Currency    string  `json:"currency"`
	Status      string  `json:"status"`
}

type Payment struct {
	PaymentID   int     `json:"payment_id"`
	InvoiceID   int     `json:"invoice_id"`
	PaymentDate string  `json:"payment_date"`
	Amount      float64 `json:"amount"`
	Method      string  `json:"method"`
	ReferenceNo string  `json:"reference_no"`
	Status      string  `json:"status"`
}

// ============================================
// 🚚 TRANSPORTATION
// ============================================

type TransportCompany struct {
	CompanyID     int     `json:"company_id"`
	CompanyName   string  `json:"company_name"`
	ContactInfo   string  `json:"contact_info"`
	LicenseNumber string  `json:"license_number"`
	Rating        float64 `json:"rating"`
}

type Truck struct {
	TruckID     int     `json:"truck_id"`
	CompanyID   int     `json:"company_id"`
	PlateNumber string  `json:"plate_number"`
	Capacity    float64 `json:"capacity"`
	FuelType    string  `json:"fuel_type"`
	Status      string  `json:"status"`
}

type Driver struct {
	DriverID        int    `json:"driver_id"`
	EmployeeID      int    `json:"employee_id"`
	LicenseNumber   string `json:"license_number"`
	ExperienceYears int    `json:"experience_years"`
	Status          string `json:"status"`
}

type Route struct {
	RouteID       int     `json:"route_id"`
	StartLocation string  `json:"start_location"`
	EndLocation   string  `json:"end_location"`
	DistanceKM    float64 `json:"distance_km"`
	EstimatedTime string  `json:"estimated_time"`
}

type Shipment struct {
	ShipmentID      int    `json:"shipment_id"`
	SOID            int    `json:"soid"`
	TruckID         int    `json:"truck_id"`
	DriverID        int    `json:"driver_id"`
	CompanyID       int    `json:"company_id"`
	RouteID         int    `json:"route_id"`
	ShipmentDate    string `json:"shipment_date"`
	Status          string `json:"status"`
	ProofOfDelivery string `json:"proof_of_delivery"`
}

type FuelLog struct {
	FuelLogID        int     `json:"fuel_log_id"`
	DriverID         int     `json:"driver_id"`
	TruckID          int     `json:"truck_id"`
	TripDate         string  `json:"trip_date"`
	DistanceTraveled float64 `json:"distance_traveled"`
}

// ============================================
// 📊 AUDIT & LOGS
// ============================================

type AuditLog struct {
	LogID          int    `json:"log_id"`
	UserID         int    `json:"user_id"`
	ActionType     string `json:"action_type"`
	EntityAffected string `json:"entity_affected"`
	Timestamp      string `json:"timestamp"`
	Description    string `json:"description"`
	IPAddress      string `json:"ip_address"`
}