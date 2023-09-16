package main

import (
	"github.com/dmcg310/Message/server/internal/database"
	"github.com/dmcg310/Message/server/internal/middleware"
	"github.com/dmcg310/Message/server/internal/routes"
	"github.com/dmcg310/Message/server/internal/ws"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"log"
	"net/http"
	"strconv"
)

func main() {
	db, r := database.InitDatabase(), mux.NewRouter()

	r.HandleFunc("/", routes.Index)
	r.HandleFunc("/messages/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.Messages(w, r, db)
		})).Methods("GET")

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

	r.HandleFunc("/messages/{ConversationId}/save/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.SendMessage(w, r, db)
		})).Methods("POST")

	r.HandleFunc("/conversations/new/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.NewConversation(w, r, db)
		})).Methods("POST")

	r.HandleFunc("/valid-username/", func(w http.ResponseWriter, r *http.Request) {
		routes.ValidateUsernames(w, r, db)
	})

	r.HandleFunc("/valid-conversation/", func(w http.ResponseWriter, r *http.Request) {
		routes.ValidateConversation(w, r, db)
	})

	r.HandleFunc("/account/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.GetAccount(w, r, db)
		})).Methods("GET")

	// 	r.HandleFunc("/new-password/", middleware.JWTMiddleware(
	// 		func(w http.ResponseWriter, r *http.Request) {
	// 			routes.UpdatePassword(w, r, db)
	// 		})).Methods("POST")
	//
	// 	r.HandleFunc("/new-username/", middleware.JWTMiddleware(
	// 		func(w http.ResponseWriter, r *http.Request) {
	// 			routes.UpdateUsername(w, r, db)
	// 		})).Methods("POST")

	r.HandleFunc("/sign-in/", func(w http.ResponseWriter, r *http.Request) {
		routes.SignIn(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/sign-out/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.SignOut(w, r, db)
		})).Methods("POST")

	r.HandleFunc("/create-account/", func(w http.ResponseWriter, r *http.Request) {
		routes.CreateAccount(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/delete-account/", middleware.JWTMiddleware(
		func(w http.ResponseWriter, r *http.Request) {
			routes.DeleteAccount(w, r, db)
		})).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "User-Id", "Authorization"},
		AllowCredentials: true,
		ExposedHeaders:   []string{"Authorization"},
	})

	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
