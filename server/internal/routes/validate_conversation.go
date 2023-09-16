package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func ValidateConversation(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var conversationId string

	err := json.NewDecoder(r.Body).Decode(&conversationId)
	if err != nil {
		fmt.Println("Error decoding JSON: ", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	var exists bool
	err = db.QueryRow("SELECT EXISTS (SELECT 1 FROM conversations WHERE id = $1)", conversationId).Scan(&exists)
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
