package handlers

import (
	"encoding/json"
	"net/http"

	"lumber-erp-api/config"
	"lumber-erp-api/models"
	"lumber-erp-api/utils"
)

// ==================== USERS ====================
func CreateUser(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	query := `INSERT INTO "User" (Email, Password, First_Name, Last_Name, Phone_Number, Status)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING User_ID`
	err := config.DB.QueryRow(query, user.Email, user.Password, user.FirstName,
		user.LastName, user.PhoneNumber, user.Status).Scan(&user.UserID)

	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, user)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT User_ID, Email, First_Name, Last_Name, 
                           Phone_Number, Status, CreatedAt FROM "User" ORDER BY CreatedAt DESC`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	users := []models.User{}
	for rows.Next() {
		var user models.User
		rows.Scan(&user.UserID, &user.Email, &user.FirstName,
			&user.LastName, &user.PhoneNumber, &user.Status, &user.CreatedAt)
		users = append(users, user)
	}
	utils.RespondJSON(w, http.StatusOK, users)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var user models.User
	query := `SELECT User_ID, Email, First_Name, Last_Name, Phone_Number, Status, CreatedAt
              FROM "User" WHERE User_ID = $1`
	err := config.DB.QueryRow(query, id).Scan(&user.UserID, &user.Email, &user.FirstName,
		&user.LastName, &user.PhoneNumber, &user.Status, &user.CreatedAt)
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, "User not found")
		return
	}
	utils.RespondJSON(w, http.StatusOK, user)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	query := `UPDATE "User" SET Email = $2, First_Name = $3, 
              Last_Name = $4, Phone_Number = $5, Status = $6 WHERE User_ID = $1`
	_, err := config.DB.Exec(query, id, user.Email, user.FirstName,
		user.LastName, user.PhoneNumber, user.Status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "User updated successfully")
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM "User" WHERE User_ID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "User deleted successfully")
}

// ==================== PERMISSIONS ====================
func CreatePermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var perm models.Permission
	json.NewDecoder(r.Body).Decode(&perm)

	query := `INSERT INTO Permission (ModuleName, ActionType) VALUES ($1, $2) RETURNING PermissionID`
	err := config.DB.QueryRow(query, perm.ModuleName, perm.ActionType).Scan(&perm.PermissionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, perm)
}

func GetPermissions(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT PermissionID, ModuleName, ActionType FROM Permission ORDER BY ModuleName`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	perms := []models.Permission{}
	for rows.Next() {
		var p models.Permission
		rows.Scan(&p.PermissionID, &p.ModuleName, &p.ActionType)
		perms = append(perms, p)
	}
	utils.RespondJSON(w, http.StatusOK, perms)
}

func UpdatePermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var perm models.Permission
	json.NewDecoder(r.Body).Decode(&perm)

	query := `UPDATE Permission SET ModuleName = $2, ActionType = $3 WHERE PermissionID = $1`
	_, err := config.DB.Exec(query, id, perm.ModuleName, perm.ActionType)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Permission updated successfully")
}

func DeletePermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Permission WHERE PermissionID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Permission deleted successfully")
}

// ==================== ROLES ====================
func CreateRole(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var role models.Role
	json.NewDecoder(r.Body).Decode(&role)

	query := `INSERT INTO Role (User_ID, Role_Name, Description) VALUES ($1, $2, $3) RETURNING Role_ID`
	err := config.DB.QueryRow(query, role.UserID, role.RoleName, role.Description).Scan(&role.RoleID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, role)
}

func GetRoles(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT Role_ID, User_ID, Role_Name, Description FROM Role ORDER BY Role_Name`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	roles := []models.Role{}
	for rows.Next() {
		var role models.Role
		rows.Scan(&role.RoleID, &role.UserID, &role.RoleName, &role.Description)
		roles = append(roles, role)
	}
	utils.RespondJSON(w, http.StatusOK, roles)
}

func UpdateRole(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	var role models.Role
	json.NewDecoder(r.Body).Decode(&role)

	query := `UPDATE Role SET User_ID = $2, Role_Name = $3, Description = $4 WHERE Role_ID = $1`
	_, err := config.DB.Exec(query, id, role.UserID, role.RoleName, role.Description)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Role updated successfully")
}

func DeleteRole(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	id := r.URL.Query().Get("id")
	_, err := config.DB.Exec(`DELETE FROM Role WHERE Role_ID = $1`, id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "Role deleted successfully")
}
// ==================== ROLE PERMISSIONS ====================
func CreateRolePermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	var rp models.RolePermission
	json.NewDecoder(r.Body).Decode(&rp)

	query := `INSERT INTO RolePermission (Role_ID, PermissionID) VALUES ($1, $2)`
	_, err := config.DB.Exec(query, rp.RoleID, rp.PermissionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondJSON(w, http.StatusCreated, rp)
}

func GetRolePermissions(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	rows, err := config.DB.Query(`SELECT Role_ID, PermissionID FROM RolePermission ORDER BY Role_ID`)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	rolePermissions := []models.RolePermission{}
	for rows.Next() {
		var rp models.RolePermission
		rows.Scan(&rp.RoleID, &rp.PermissionID)
		rolePermissions = append(rolePermissions, rp)
	}
	utils.RespondJSON(w, http.StatusOK, rolePermissions)
}

func GetRolePermissionsByRole(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	roleID := r.URL.Query().Get("id")
	
	rows, err := config.DB.Query(`SELECT Role_ID, PermissionID FROM RolePermission WHERE Role_ID = $1`, roleID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	rolePermissions := []models.RolePermission{}
	for rows.Next() {
		var rp models.RolePermission
		rows.Scan(&rp.RoleID, &rp.PermissionID)
		rolePermissions = append(rolePermissions, rp)
	}
	utils.RespondJSON(w, http.StatusOK, rolePermissions)
}

func GetRolePermissionsByPermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	permissionID := r.URL.Query().Get("id")
	
	rows, err := config.DB.Query(`SELECT Role_ID, PermissionID FROM RolePermission WHERE PermissionID = $1`, permissionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	rolePermissions := []models.RolePermission{}
	for rows.Next() {
		var rp models.RolePermission
		rows.Scan(&rp.RoleID, &rp.PermissionID)
		rolePermissions = append(rolePermissions, rp)
	}
	utils.RespondJSON(w, http.StatusOK, rolePermissions)
}

func DeleteRolePermission(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	roleID := r.URL.Query().Get("role_id")
	permissionID := r.URL.Query().Get("permission_id")
	
	_, err := config.DB.Exec(`DELETE FROM RolePermission WHERE Role_ID = $1 AND PermissionID = $2`, roleID, permissionID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondSuccess(w, "RolePermission deleted successfully")
}

func AssignPermissionsToRole(w http.ResponseWriter, r *http.Request) {
	utils.EnableCORS(&w)
	
	var data struct {
		RoleID        int   `json:"role_id"`
		PermissionIDs []int `json:"permission_ids"`
	}
	json.NewDecoder(r.Body).Decode(&data)

	// Start transaction
	tx, err := config.DB.Begin()
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Delete existing permissions for this role
	_, err = tx.Exec(`DELETE FROM RolePermission WHERE Role_ID = $1`, data.RoleID)
	if err != nil {
		tx.Rollback()
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Insert new permissions
	for _, permID := range data.PermissionIDs {
		_, err = tx.Exec(`INSERT INTO RolePermission (Role_ID, PermissionID) VALUES ($1, $2)`, data.RoleID, permID)
		if err != nil {
			tx.Rollback()
			utils.RespondError(w, http.StatusInternalServerError, err.Error())
			return
		}
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondSuccess(w, "Permissions assigned successfully")
}