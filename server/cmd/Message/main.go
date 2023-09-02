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
	r.HandleFunc("/messages/{conversationId}", routes.Conversations).Methods("GET") // gets all messages for a conversation

	log.Fatal(http.ListenAndServe(":8080", r))
}
