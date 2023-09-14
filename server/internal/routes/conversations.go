package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/dmcg310/Message/server/internal/auth"
	"net/http"
)

func NewConversation(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Authorization header not found", http.StatusUnauthorized)
		return
	}

	userId, err := auth.ParseJWT(tokenString)
	if err != nil {
		http.Error(w, "Invalid token GetAccount", http.StatusUnauthorized)
		return
	}
	// userid is currently SIGNED IN user

	var otherUsername string

	err = json.NewDecoder(r.Body).Decode(&otherUsername)
	if err != nil {
		fmt.Println("Error decoding JSON: ", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	var otherUserID int
	err = db.QueryRow("SELECT id FROM users WHERE username = $1", otherUsername).Scan(&otherUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Other user does not exist", http.StatusNotFound)
			return
		}
		http.Error(w, "Error querying database", http.StatusInternalServerError)
		return
	}

	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Error starting transaction", http.StatusInternalServerError)
		return
	}

	defer tx.Rollback()

	var conversationID int64
	err = tx.QueryRow("INSERT INTO conversations (created_at) VALUES (NOW()) RETURNING id").Scan(&conversationID)
	if err != nil {
		http.Error(w, "Error creating conversation", http.StatusInternalServerError)
		return
	}

	if err != nil {
		http.Error(w, "Error getting conversation ID", http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec("INSERT INTO participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
		conversationID, userId, otherUserID)
	if err != nil {
		http.Error(w, "Error adding participants to conversation", http.StatusInternalServerError)
		return
	}

	err = tx.Commit()
	if err != nil {
		http.Error(w, "Error committing transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte(fmt.Sprintf(`{"message": "Conversation created successfully", "conversation_id": %d}`, conversationID)))
	if err != nil {
		http.Error(w, "Error writing to response", http.StatusInternalServerError)
		return
	}
}
