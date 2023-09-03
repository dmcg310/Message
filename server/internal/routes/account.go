package routes

/* TODO:
* - handle actual forms from frontend
* - remember me token
 */

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
		UserID:   5,
		Username: "JDoe",
		Email:    "john_though@gmail.com",
		Password: "Password123",
		RMToken:  "8asd7f8918172",
	}
	_ = details

	emailExists    bool
	usernameExists bool
	userExists     bool
)

func GetAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	err := db.QueryRow("SELECT * FROM users WHERE id = $1", details.UserID).Scan(&details.UserID, &details.Username, &details.Email, &details.Password, &details.RMToken)
	if err != nil {
		fmt.Println("Error retrieving account info: ", err)
		return
	}

	// do something with details
}

func CreateAccount(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// TODO: Hash password & http responses
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

func SignIn() {
	// TODO: compare login info with DB, (unhash pw and check), if RM, generate token
	// TODO: store token securely in frontend
}

func SignOut() {
	// TODO: sign out user by removing RM token
}
