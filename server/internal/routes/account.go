package routes

// TODO: handle actual forms from frontend

import (
	"database/sql"
	"fmt"
	"github.com/dmcg310/Message/server/internal/auth"
	"net/http"
)

type Details struct {
	UserID   int
	Username string
	Email    string
	Password string
}

var (
	// should be real form data
	details Details = Details{
		UserID:   5,
		Username: "JDoe",
		Email:    "john_though@gmail.com",
		Password: "Password123",
	}
	_ = details

	emailExists    bool
	usernameExists bool
	userExists     bool
)

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

	_ = userID
	// TODO: use userID to fetch account details from the database
}

func CreateAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
		details.Email).Scan(&emailExists)
	if err != nil {
		fmt.Println("Error checking if email exists in database: ", err)
		return
	}

	if emailExists {
		fmt.Println("Email already exists")
		return
	}

	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
		details.Username).Scan(&usernameExists)
	if err != nil {
		fmt.Println("Error checking if username exists in database: ", err)
		return
	}

	if usernameExists {
		fmt.Println("Username already exists")
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
	// TODO: http responses
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", details.UserID).Scan(&userExists)
	if err != nil {
		fmt.Println("Error checking if email exists in database: ", err)
		return
	}

	if !userExists {
		fmt.Println("User does not exist")
		return
	}

	_, err = db.Exec("DELETE FROM users WHERE id = $1", details.UserID)
	if err != nil {
		fmt.Println("Error inserting into database: ", err)
		return
	}
}

func SignIn(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	hashedPassword, err := auth.HashPassword(details.Password)
	if err != nil {
		fmt.Println("Error hashing password: ", err)
		return
	}

	match := auth.ComparePassword(hashedPassword, details.Password)
	if !match {
		fmt.Println("Passwords do not match")
		return
	}

	err = db.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND password = $2)",
		details.Email, hashedPassword).Scan(&userExists)
	if err != nil {
		fmt.Println("Error checking if email exists in database: ", err)
		return
	}

	if !userExists {
		fmt.Println("User does not exist")
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

func SignOut(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// TODO
}
