package main

import (
	"github.com/dmcg310/Message/server/internal/database"
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	db := database.InitDatabase() // error handling is done in InitDatabase()
	_ = db

	r := mux.NewRouter()
	r.HandleFunc("/", routes.Index)                                                 // index
	r.HandleFunc("/messages/", routes.Messages).Methods("GET")                      // gets all messages
	r.HandleFunc("/messages/{ConversationId}", routes.Conversations).Methods("GET") // gets all messages for a conversation

	r.HandleFunc("/account/", func(w http.ResponseWriter, r *http.Request) {
		routes.GetAccount(w, r, db)
	}).Methods("GET")
	// r.HandleFunc("/sign-in/", routes.SignIn).Methods("GET")
	// r.HandleFunc("/sign-out/", routes.SignOut).Methods("POST")
	r.HandleFunc("/create-account/", func(w http.ResponseWriter, r *http.Request) {
		routes.CreateAccount(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/delete-account/", func(w http.ResponseWriter, r *http.Request) {
		routes.DeleteAccount(w, r, db)
	}).Methods("POST")

	log.Fatal(http.ListenAndServe(":8080", r))
}
