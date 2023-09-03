package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/dmcg310/Message/server/internal/database"
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/dmcg310/Message/server/internal/ws"
	"github.com/gorilla/mux"
)

func main() {
	db := database.InitDatabase() // error handling is done in the function
	_ = db
	r := mux.NewRouter()

	r.HandleFunc("/", routes.Index)
	r.HandleFunc("/messages/", routes.Messages).Methods("GET")
	r.HandleFunc("/messages/{ConversationId}", routes.Conversations).Methods("GET")
	r.HandleFunc("/messages/{ConversationId}/", func(w http.ResponseWriter, r *http.Request) {
		conversationID, err := strconv.Atoi(mux.Vars(r)["ConversationId"])
		if err != nil {
			log.Println(err)
		}

		err = ws.NewWS(w, r, db, conversationID)
		if err != nil {
			log.Println(err)
		}
	})
	r.HandleFunc("/account/", func(w http.ResponseWriter, r *http.Request) {
		routes.GetAccount(w, r, db)
	}).Methods("GET")

	r.HandleFunc("/sign-in/", func(w http.ResponseWriter, r *http.Request) {
		routes.SignIn(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/sign-out/", func(w http.ResponseWriter, r *http.Request) {
		routes.SignOut(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/create-account/", func(w http.ResponseWriter, r *http.Request) {
		routes.CreateAccount(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/delete-account/", func(w http.ResponseWriter, r *http.Request) {
		routes.DeleteAccount(w, r, db)
	}).Methods("POST")

	log.Fatal(http.ListenAndServe(":8080", r))
}
