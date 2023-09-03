package main

import (
	"log"
	"net/http"
	"github.com/dmcg310/Message/server/internal/database"
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/gorilla/mux"
)

func main() {
	database.InitDatabase() // error handling is done in InitDatabase()

	r := mux.NewRouter()
	r.HandleFunc("/", routes.Index)                                                 // index
	r.HandleFunc("/messages/", routes.Messages).Methods("GET")                      // gets all messages
	r.HandleFunc("/messages/{ConversationId}", routes.Conversations).Methods("GET") // gets all messages for a conversation

	// r.HandleFunc("/account/{UserID}", routes.Account).Methods("GET")
	// r.HandleFunc("/sign-in/", routes.SignIn).Methods("GET")
	// r.HandleFunc("/sign-out/", routes.SignOut).Methods("POST")
	// r.HandleFunc("/create-account/", routes.CreateAccount).Methods("POST")
	// r.HandleFunc("/delete-account/", routes.DeleteAccount).Methods("POST")

	log.Fatal(http.ListenAndServe(":8080", r))
}
