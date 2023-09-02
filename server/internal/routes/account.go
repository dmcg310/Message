package routes

// TODO: handle actual forms from frontend

// import (
// "html/template"
// "net/http"
// )

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

func CreateAccount() {
	// TODO: check if email already in database, if not, insert and hash password
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
