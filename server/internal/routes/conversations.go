package routes

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func Conversations(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	conversationId := vars["ConversationId"]

	_, err := w.Write([]byte("Conversations, id: " + conversationId))
	if err != nil {
		log.Printf("Could not write response: %s\n", err.Error())
	}
}
