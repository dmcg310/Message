package main

import (
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
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
