package routes

// TODO: handle actual forms from frontend

import (
	"database/sql"
	"fmt"
	"net/http"
)

type Details struct {
	UserID   int
	Username string
	Email    string
	Password string
	RMToken  string // remember me token
}

var (
	// should be real form data
	details Details = Details{
		UserID:   1,
		Username: "JDoe",
		Email:    "john_though@gmail.com",
		Password: "Password123",
		RMToken:  "8asd7f8918172",
	}

	_ = details
)

func GetAccount() {
	// TODO: check if user is logged in, if not, redirect to login page
}

func CreateAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// TODO: Hash password & http responses
	var (
		emailExists    bool
		usernameExists bool
	)

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

	_, err = db.Exec("INSERT INTO users (username, email, password, remember_me_token) VALUES ($1, $2, $3, $4)",
		details.Username, details.Email, details.Password, details.RMToken)
	if err != nil {
		fmt.Println("Error inserting into database: ", err)
		return
	}
}

func DeleteAccount() {
	// TODO: check if account exists, if it does, delete account
}

func SignIn() {
	// TODO: compare login info with DB, (unhash pw and check), if RM, generate token
	// TODO: store token securely in frontend
}

func SignOut() {
	// TODO: sign out user by removing RM token
}
