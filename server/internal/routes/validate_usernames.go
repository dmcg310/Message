package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func ValidateUsernames(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var username string

	err := json.NewDecoder(r.Body).Decode(&username)
	if err != nil {
		fmt.Println("Error decoding JSON: ", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	var exists bool
	err = db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)", username).Scan(&exists)
	if err != nil {
		fmt.Println("Error querying database: ", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := struct {
		IsValid bool `json:"isValid"`
	}{
		IsValid: exists,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		fmt.Println("Error encoding response: ", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}
