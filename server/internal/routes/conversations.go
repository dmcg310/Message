package routes

import (
	"database/sql"
	"net/http"
	// "encoding/json"
	// "fmt"
	"github.com/dmcg310/Message/server/internal/auth"
	// "net/http"
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

	_ = userId

	// other users in conversation will be provided in request body

	// TODO
	// create new conversation (id, created_at)
	// all participants linked to conversation e.g
	// conversation_id user_id
	// 1                 1 // current signed in user
	// 1                 2 // other user that was provided in request body
}
