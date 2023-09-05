package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/dmcg310/Message/server/internal/auth"
	"net/http"
)

var userExists bool

func GetAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Authorization header not found", http.StatusUnauthorized)
		return
	}

	userID, err := auth.ParseJWT(tokenString)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	rows, err := db.Query("SELECT username, email FROM users WHERE id = $1", userID)
	if err != nil {
		http.Error(w, "Error retrieving account details", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var accountDetails struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	if rows.Next() {
		if err := rows.Scan(&accountDetails.Username, &accountDetails.Email); err != nil {
			http.Error(w, "Error scanning account details row", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(accountDetails); err != nil {
			http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "No account details found", http.StatusNotFound)
	}
}

func CreateAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var details struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
		UserID   int    `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&details); err != nil {
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}

	var emailExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
		details.Email).Scan(&emailExists)
	if err != nil {
		http.Error(w, "Error checking if email exists in database",
			http.StatusInternalServerError)
		return
	}

	if emailExists {
		http.Error(w, "Email already exists", http.StatusBadRequest)
		return
	}

	var usernameExists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
		details.Username).Scan(&usernameExists)
	if err != nil {
		http.Error(w, "Error checking if username exists in database",
			http.StatusInternalServerError)
		return
	}

	if usernameExists {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	hashedPassword, err := auth.HashPassword(details.Password)
	if err != nil {
		fmt.Println("Error hashing password: ", err)
		return
	}

	_, err = db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
		details.Username, details.Email, hashedPassword)
	if err != nil {
		fmt.Println("Error inserting into database: ", err)
		return
	}

	tokenString, err := auth.GenerateJWT(details.UserID)
	if err != nil {
		fmt.Println("Error generating JWT: ", err)
		return
	}

	_, error := w.Write([]byte(tokenString))
	if error != nil {
		fmt.Println("Error writing to response: ", error)
		return
	}
}

func DeleteAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var details struct {
		UserID int `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&details); err != nil {
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}

	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", details.UserID).Scan(&userExists)
	if err != nil {
		http.Error(w, "Error checking if user exists in database", http.StatusInternalServerError)
		return
	}

	if !userExists {
		http.Error(w, "User does not exist", http.StatusNotFound)
		return
	}

	_, err = db.Exec("DELETE FROM users WHERE id = $1", details.UserID)
	if err != nil {
		http.Error(w, "Error deleting from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte(`{"message": "Account deleted successfully"}`))
	if err != nil {
		http.Error(w, "Error writing to response", http.StatusInternalServerError)
		return
	}
}

func SignIn(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var details struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		UserID   int    `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&details); err != nil {
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}

	var hashedPassword string

	err := db.QueryRow("SELECT password FROM users WHERE email = $1",
		details.Email).Scan(&hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User does not exist", http.StatusNotFound)
			return
		}

		http.Error(w, "Error querying database", http.StatusInternalServerError)
		return
	}

	match := auth.ComparePassword(hashedPassword, details.Password)
	if !match {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	tokenString, err := auth.GenerateJWT(details.UserID)
	if err != nil {
		http.Error(w, "Error generating JWT", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte(`{"token": "` + tokenString + `"}`))
	if err != nil {
		http.Error(w, "Error writing to response", http.StatusInternalServerError)
		return
	}
}

func SignOut(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	_, err := w.Write([]byte(`{"message": "Remove JWT from client"}`))
	if err != nil {
		http.Error(w, "Error writing to response", http.StatusInternalServerError)
		return
	}
}
